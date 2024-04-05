// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.8.25;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IdentityRegistry.sol";
import "./Compliance.sol";
import "./TokenRegistry.sol";

/// @notice Implémentation simplifiée d'un token ERC20 à des fins de démonstration.
contract SimpleERC20Token is ERC20 {
    /// @dev Crée un token ERC20 avec une quantité initiale mintée pour le créateur.
    /// @param name Nom du token.
    /// @param symbol Symbole du token.
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        _mint(msg.sender, 1000 * 10**uint(decimals())); // Mint une quantité initiale de tokens
    }
}

/// @notice Permet la création de tokens ERC20 pour la tokenisation d'actifs.
contract AssetTokenization is Ownable {
    IdentityRegistry private identityRegistry;
    Compliance private compliance;
    TokenRegistry private tokenRegistry;

    /// @notice Événement émis lors de la création d'un nouveau token ERC20.
    event TokenCreated(address indexed tokenAddress, string name, string symbol);

    /// @dev Initialise le contrat avec les adresses des contrats de support
    /// @param initialOwner Adresse du propriétaire initial du contrat.
    constructor(address _identityRegistryAddress, address _complianceAddress, address _tokenRegistryAddress, address initialOwner) Ownable(initialOwner) {
        identityRegistry = IdentityRegistry(_identityRegistryAddress);
        compliance = Compliance(_complianceAddress);
        tokenRegistry = TokenRegistry(_tokenRegistryAddress);
    }

    /// @notice Crée un nouveau token ERC20.
    /// @dev Seul le propriétaire du contrat peut créer un nouveau token.
    /// @param name Nom du token à créer.
    /// @param symbol Symbole du token à créer.
    function createToken(string memory name, string memory symbol) public onlyOwner {
        // Vérifie que le créateur a passé la vérification KYC.
        require(identityRegistry.getKycStatus(msg.sender), unicode"AssetTokenization: Le créateur doit passer la vérification KYC.");
        // Vérifie que la création est conforme aux règles de compliance.
        require(compliance.checkCompliance(msg.sender, address(this), 0), unicode"AssetTokenization: Création non conforme.");

        // Crée un nouveau token ERC20 et enregistre son adresse dans le registre des tokens.
        SimpleERC20Token newToken = new SimpleERC20Token(name, symbol);
        tokenRegistry.registerToken(name, symbol, address(newToken));

        // Émet un événement indiquant la création du token.
        emit TokenCreated(address(newToken), name, symbol);
    }
}
