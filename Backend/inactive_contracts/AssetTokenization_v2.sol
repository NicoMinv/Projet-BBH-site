// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.8.25;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
//import "./IdentityRegistry.sol";
//import "./Compliance.sol";
//import "./TokenRegistry.sol";
//import "./ERC20initializable.Sol";

/// @title Contrat de tokenisation d'actifs
/// @notice Ce contrat va faire office de Token Factory pour créer des tokens ERC-20 . Il va créer un contrat de token de base qui est cloné pour chaque nouveau token. 
contract AssetTokenization is Ownable {

    /// @dev Ajoute la fonctionnalité de clonage aux adresses en utilisant la bibliothèque Clones d'OpenZeppelin.
    /// @notice Cette ligne permet de créer des copies légère (peu de couts en gaz) de contrats
    using Clones for address;

    //Adresse de l'implémentation du token de base qui sera utilisée pour créer des clones.
    /// @param immutable vient fixer la variable tokenImplementation pour toute la durée de vie du contrat.
    address immutable tokenImplementation;

    /// @dev Instance du contrat `IdentityRegistry` pour intégrer la gestion des identités des utilisateurs.
    ///@notice  Permet d'accéder aux informations KYC des utilisateurs pour assurer la conformité des opérations 
    IdentityRegistry private identityRegistry;

    /// @dev Instance du contrat `Compliance` pour intégrer les vérifications de conformité des transactions.
    /// @notice Pour s'assurer que toutes les opérations de tokenisation et les transferts de tokens
    /// respectent les normes réglementaires et les exigences KYC.
    Compliance private compliance;

    /// @notice Événement pour signaler la création d'un nouveau token représentant un actif.
    event TokenCreated(address indexed tokenAddress, string name, string symbol);

    /// @notice Constructeur pour déployer le contrat modèle de token ERC20 et initialiser les contrats de vérification.
    /// @param _tokenImplementation  C'est l'adresse du contrat de token ERC20 qui sera utilisé comme modèle pour créer des clones de token pour chaque nouvel actif tokenisé. 
    /// @param _identityRegistryAddress Adresse du contrat IdentityRegistry pour la gestion des statuts KYC.
    /// @param _complianceAddress Adresse du contrat Compliance pour la vérification de conformité.
    constructor(address _tokenImplementation, address _identityRegistryAddress, address _complianceAddress) {
        tokenImplementation = _tokenImplementation;
        identityRegistry = IdentityRegistry(_identityRegistryAddress);
        compliance = Compliance(_complianceAddress);
    }

    /// @notice Crée un nouveau token ERC-20 pour un actif donné, après vérification de conformité.
    /// @param name Nom du nouveau token
    /// @param symbol Symbole du nouveau token.
    /// @notice Seul le propriétaire du contrat peut créer un nouveau token
    function createToken(string memory name, string memory symbol) public onlyOwner {
        require(identityRegistry.getKycStatus(msg.sender), unicode"AssetTokenization: Le créateur doit passer la vérification KYC.");

        // Clone le contrat ERC20Initializable
        address clone = tokenImplementation.clone();

        // Initialise le clone avec le nom et le symbole spécifiés
        ERC20Initializable(clone).initialize(name, symbol);

        require(compliance.checkCompliance(msg.sender, address(this), 0), unicode"AssetTokenization: Création non conforme aux règles de compliance.");

        /// @notice Fonction qui enregistre le nouveau token dans notre contrat répertoire TokenRegistry.sol
        TokenRegistry.registerToken(name, symbol, clone);

        /// @notice Événement pour signaler qu'un token a été crée dans TokenRegistry.sol
        emit TokenCreated(clone, name, symbol);
    }
}
