// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.8.25;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Compliance.sol";
import "./TokenRegistry.sol";
import "./LiquidityPool.sol";

/// @notice On va appeler une interface pour LiquidityPool
interface ILiquidityPool {
    // On déclare ici seulement la fonction dont on a besoin de LiquidityPool
    function provideLiquidityTo(address _to, uint256 _amount, bool isUSDT) external;
}

/// @title Contrat de gestion des prêts
/// @notice Ce contrat gère la création, le suivi et le remboursement des prêts sur notre plateforme.
contract Lending is Ownable {

    /// @dev Structure pour conserver les détails d'un prêt.
    struct Loan {
        uint256 principal; // Montant initial du prêt
        uint256 interestRate; // Taux d'intérêt annuel (ù)
        bool isPaid; // Statut du remboursement du prêt
        uint256 startTime; // Heure de début du prêt : timestamp
    }

    /// @dev Mapping liant les emprunteurs à leurs informations de prêt.
    mapping(address => Loan) public loans;

    /// @dev Références aux contrats pour les vérifications et les opérations.
    Compliance public compliance;
    TokenRegistry public tokenRegistry;
    /// @dev Pour LiquidityPool, on utilise l'interface plutôt que le type de contrat directement
    ILiquidityPool public liquidityPool;

    /// @notice Événement qui vient signifier la création d'un nouveau prêt
    event LoanCreated(address indexed borrower, uint256 principal, uint256 interestRate, uint256 startTime);

    /// @notice Événement déclenché lorsque le prêt est remboursé
    event LoanRepaid(address indexed borrower, uint256 repaidAmount);

    /// @notice Initialise le contrat avec les adresses des autres contrats 
    constructor(address _complianceAddress, address _tokenRegistryAddress, address _liquidityPoolAddress, address initialOwner) Ownable(initialOwner) {
        liquidityPool = ILiquidityPool(_liquidityPoolAddress);
        compliance = Compliance(_complianceAddress);
        tokenRegistry = TokenRegistry(_tokenRegistryAddress);
    }

    /// @notice Créer un prêt pour un emprunteur avec un montant principal et un taux d'intérêt spécifié
    /// @dev Seul le propriétaire peut créer un prêt
    /// @param _borrower Adresse de l'emprunteur.
    /// @param _principal Montant principal du prêt
    /// @param _interestRate Taux d'intérêt du prêt.
    function createLoan(address _borrower, uint256 _principal, uint256 _interestRate) external onlyOwner {

        // Validation des paramètres du prêt et vérification de la conformité.
        require(_principal > 0, "Principal must be greater than 0");
        require(loans[_borrower].principal == 0, "Loan already exists");
        require(compliance.checkCompliance(msg.sender, _borrower, _principal), "Compliance check failed");

        // Création et enregistrement du prêt.
        loans[_borrower] = Loan({
            principal: _principal,
            interestRate: _interestRate,
            isPaid: false,
            startTime: block.timestamp
        });

        // Transférer le montant du prêt depuis le pool de liquidité vers l'emprunteur.
        liquidityPool.provideLiquidityTo(_borrower, _principal, false); // False indique l'utilisation d'Ether.

        emit LoanCreated(_borrower, _principal, _interestRate, block.timestamp);
    }

    /// @notice Permet à un emprunteur de rembourser son prêt
    /// @param _borrower Adresse de l'empruteur remboursant le prêt
    function repayLoan(address _borrower) external payable {
        Loan storage loan = loans[_borrower];
        // On vérifie que le prêt n'a pas déjà été remboursé.
        require(!loan.isPaid, "Loan already repaid");

        // Calcul et validation du montant dû.
        uint256 owedAmount = calculateOwedAmount(_borrower);
        require(msg.value >= owedAmount, "Insufficient amount to repay the loan");

        // Si l'emprunteur a envoyé plus que le montant dû, l'excédent lui est retourné avant de marquer le prêt comme remboursé.
        uint256 excessAmount = msg.value > owedAmount ? msg.value - owedAmount : 0;

        loan.isPaid = true; // Marque le prêt comme remboursé

        if (excessAmount > 0) {
            payable(_borrower).transfer(excessAmount);
        }

        emit LoanRepaid(_borrower, owedAmount);
    }

    /// @notice Calcule le montant total dû pour un prêt, incluant les intérêts.
    /// @param _borrower Adresse de l'emprunteur.
    /// @return Le montant total dû.
    function calculateOwedAmount(address _borrower) public view returns (uint256) {
        Loan memory loan = loans[_borrower];
        // On vérifie que le prêt n'a pas déjà été remboursé.
        require(loan.principal > 0, "Loan does not exist");

        // Calcul des intérêts basé sur la durée du prêt. Ici on vient calculer un taux d'intérêt, on le calcul avec a différence entre le timestamp actuel (block.timestamp) et le timestamp de début du prêt (loan.startTime).
        uint256 timeElapsed = block.timestamp - loan.startTime;

        ///@param loan.principal c'est le prêt 
        /// @param loan.interestRate est le taux d'intérêt annuel du prêt. Par exemple, un taux d'intérêt de 5% serait représenté par le chiffre 5
        /// @param timeElapsed est le temps écoulé depuis l'émission du prêt, calculé dans la ligne précédente.
        /// On va ensuite convertir le tout dans un format décimal avec (365 days * 100)
        uint256 interest = (loan.principal * loan.interestRate * timeElapsed) / (365 days * 100);
        return loan.principal + interest;
    }
}
