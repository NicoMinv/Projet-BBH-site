// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.8.25;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Contrat qui va faire office de pool de Liquidité pour le trading et pour les prêts.
/// @notice Ce contrat gère la liquidité en USDT et en Ether pour soutenir les opérations de trading et de prêt sur la plateforme.
contract LiquidityPool is Ownable {

    // Pour la gestion des dépôts en USDT.
    IERC20 public usdtToken;

    // Adresses des contrats de trading et de prêt pour les interactions
    address public tradingContract;

    ///@notice Suivi des dépôts en USDT et en Ether pour chaque utilisateur.
    mapping(address => uint256) public usdtDeposits;
    mapping(address => uint256) public etherDeposits;

    /// @notice On vient récuperer les moments ou il y a des échanges
    /// @dev Événements pour le suivi des ajouts et retraits de liquidité.
    event LiquidityAdded(address indexed provider, uint256 amount, bool isUSDT);
    event LiquidityRemoved(address indexed provider, uint256 amount, bool isUSDT);

    /// @notice Initialise le pool de liquidité avec les adresses de contrats nécessaires
    /// @param _usdtAddress Adresse du token USDT utilisé pour la liquidité.
    /// @param _tradingContract Adresse du contrat de trading pour permettre des interactions spécifiques
    /// param _lendingContract Adresse du contrat de prêt pour permettre des interactions spécifiques. 
    /// param _lendingContract Pour l'instant, comme il y a une circularité lors du déploiement entre LiquidityPool et Lending, j'ai enlevé ce param.
    constructor(address _usdtAddress, address _tradingContract, address initialOwner) Ownable(initialOwner) {
        usdtToken = IERC20(_usdtAddress);
        tradingContract = _tradingContract;
    }   

            /// ----------------------- Pour les particuliers qui veulent envoyés ou retirer ce qu'ils ont envoyés au pool--------------------///

    /// @notice Permet aux utilisateurs d'ajouter de la liquidité en USDT au pool.
    /// @param _amount Montant d'USDT à déposer.
    function addUsdtLiquidity(uint256 _amount) external {
        require(usdtToken.transferFrom(msg.sender, address(this), _amount), "Transfer failed");
        usdtDeposits[msg.sender] += _amount;
        emit LiquidityAdded(msg.sender, _amount, true);
    }

    /// @notice Permet aux utilisateurs de retirer leur liquidité en USDT du pool.
    /// @param _amount Montant d'USDT à retirer.
    function removeUsdtLiquidity(uint256 _amount) external {
        require(usdtDeposits[msg.sender] >= _amount, "Insufficient balance");
        usdtDeposits[msg.sender] -= _amount;
        require(usdtToken.transfer(msg.sender, _amount), "Transfer failed");
        emit LiquidityRemoved(msg.sender, _amount, true);
    }

    /// @notice Permet aux utilisateurs d'ajouter de la liquidité en Ether au pool
    function addEtherLiquidity() external payable {
        etherDeposits[msg.sender] += msg.value;
        emit LiquidityAdded(msg.sender, msg.value, false);
    }

    /// @notice Permet aux utilisateurs de retirer leur liquidité en Ether du pool. 
    /// @param _amount Montant d'Ether à retirer
    function removeEtherLiquidity(uint256 _amount) external {
        require(etherDeposits[msg.sender] >= _amount, "Insufficient balance");
        etherDeposits[msg.sender] -= _amount;
        payable(msg.sender).transfer(_amount);
        emit LiquidityRemoved(msg.sender, _amount, false);
    }

    // ----------------On met cette fonction de vérification en veille pour l'instant, elle me complique le déploiement pour la présentation. ------------- // 


    /// @notice Permet aux contrats de trading et de prêt d'accéder à la liquidité pour leurs opérations.
    /// param _to Adresse destinataire de la liquidité.
    /// param _amount Montant de la liquidité à fournir
    /// param isUSDT Spécifie si la liquidité est en USDT (true) ou en Ether (false). Bool facilite parce que c'est binaire pour l'instant.
    /*function provideLiquidityTo(address _to, uint256 _amount, bool isUSDT) external {
        require(msg.sender == tradingContract || msg.sender == lendingContract, "Unauthorized");
        if (isUSDT) {
            require(usdtToken.transfer(_to, _amount), "USDT Transfer failed");
        } else {
            payable(_to).transfer(_amount);
        }
    }
    */


    // Fonction de réception d'Ether pour permettre des dépôts 
    receive() external payable {}

    /// @notice Permet au propriétaire de retirer des fonds du contrat, que ce soit en USDT ou en Ether. C'est pour le owner du contrat (nous).
    /// @param _to Adresse destinataire des fonds.
    /// @param _amount Montant à retirer.
    /// @param isUSDT Spécifie si le retrait est en USDT (true) ou en Ether (false).
    function withdrawFunds(address _to, uint256 _amount, bool isUSDT) external onlyOwner {
        if (isUSDT) {
            require(usdtToken.transfer(_to, _amount), "USDT Transfer failed");
        } else {
            payable(_to).transfer(_amount);
        }
    }
}
