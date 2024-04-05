// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.8.25;

import "./Compliance.sol";
import "./TokenRegistry.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Contrat qui permet le trading de tokens sur la plateforme
/// @notice Permet l'échange de tokens contre des USDT (Ethers aussi) en respectant les normes de conformité
contract Trading is Ownable {

    /// @notice L'adresse du contrat d'USDT utilisé pour les transactions sur la plateforme.
    address public usdtAddress;

    /// Instance des contrats Compliance et TokenRegistry
    Compliance public complianceContract; 
    TokenRegistry public tokenRegistry; 

    /// @notice Prix d'un token en Ether
    uint256 public tokenPriceInEther;

    // Événement émis lorsqu'un échange en USTD est réalisé avec succès
    event TradeExecuted(address indexed seller, address indexed buyer, address tokenAddress, uint256 tokenAmount, uint256 usdtAmount);
    // Événement émis lorsqu'un échange en Ether est réalisé avec succès
    event EtherTradeExecuted(address indexed seller, address indexed buyer, uint256 etherAmount, uint256 tokenAmount);

    /// @notice Crée une instance du contrat Trading avec des adresses spécifiques pour l'USDT, la conformité et le registre de tokens.
    /// @param _usdtAddress L'adresse du token USDT utilisé pour les échanges
    /// @param _complianceAddress L'adresse du contrat Compliance pour la conformité.
    /// @param _tokenRegistryAddress L'adresse du contrat TokenRegistry pour la vérification de l'enregistrement des tokens
    constructor(address _usdtAddress, address _complianceAddress, address _tokenRegistryAddress, address initialOwner) Ownable(initialOwner) {
        usdtAddress = _usdtAddress;
        complianceContract = Compliance(_complianceAddress);
        tokenRegistry = TokenRegistry(_tokenRegistryAddress);
    }

    /// @notice Permet au propriétaire du contrat de mettre à jour le prix d'un token en Ether
    function setTokenPriceInEther(uint256 _newTokenPriceInEther) external onlyOwner {
        tokenPriceInEther = _newTokenPriceInEther;
    }

    /// @notice Exécute un échange de tokens crées chez nous contre des USDT entre un vendeur et un acheteur
    /// @param _tokenAddress L'adresse du token échangé
    /// @param _seller L'adresse du vendeur des tokens
    /// @param _buyer L'adresse de l'acheteur des tokens
    /// @param _tokenAmount La quantité de tokens échangée.
    /// @param _usdtAmount La quantité de USDT échangée.
    /// @dev L'échange est autorisé seulement si les critères de conformité et d'enregistrement du token sont respectés
    function executeTrade(address _tokenAddress, address _seller, address _buyer, uint256 _tokenAmount, uint256 _usdtAmount) external {
        
        // Ici on vérifie la conformité et le bon enregistrement du token
        require(tokenRegistry.isTokenRegistered(_tokenAddress), unicode"Trading: Token non enregistré.");
        require(complianceContract.checkCompliance(_seller, _buyer, _tokenAmount), unicode"Trading: Transaction non conforme.");
        
        // Ici on effectue la transaction et on vérifie aussi qu'elle a bien eu lieu.
        require(IERC20(_tokenAddress).transferFrom(_seller, _buyer, _tokenAmount), unicode"Trading: Le transfert de tokens a échoué.");
        require(IERC20(usdtAddress).transferFrom(_buyer, _seller, _usdtAmount), unicode"Trading: Le transfert d'USDT a échoué.");

        emit TradeExecuted(_seller, _buyer, _tokenAddress, _tokenAmount, _usdtAmount);
    }

    /// @notice Exécute un échange de tokens crées chez nous contre des Ethers entre un vendeur et un acheteur
    /// @param _tokenAddress Adresse du token à échanger
    /// @param _seller Adresse du vendeur des tokens
    /// @param _buyer Adresse de l'acheteur.
    /// @param _tokenAmount Quantité de tokens à échanger.
    /// @dev L'Ether est envoyé directement à partir de l'appel de la transaction
    function executeTradeWithEther(address _tokenAddress, address _seller, address _buyer, uint256 _tokenAmount) external payable {
        require(tokenRegistry.isTokenRegistered(_tokenAddress), unicode"Trading: Token non enregistré.");
        require(complianceContract.checkCompliance(_seller, _buyer, _tokenAmount), "Trading: Transaction non conforme.");

        ///@notice Calcul du montant d'Ether nécessaire pour l'achat des tokens.
        uint256 requiredEtherAmount = _tokenAmount * tokenPriceInEther;
        
        ///@notice On Vérifie ici si la quantité d'Ether envoyée correspond au prix d'achat
        require(msg.value >= requiredEtherAmount, 'Montant Ether insuffisant.');
        
        ///@notice Transfère des tokens de _seller à _buyer
        require(IERC20(_tokenAddress).transferFrom(_seller, _buyer, _tokenAmount), unicode"Trading: Le transfert de tokens a échoué.");
        
        ///@notice Au cas ou il y a trop d'ether envoyé, on transfère l'Ether excédentaire à l'acheteur.
        if(msg.value > requiredEtherAmount) {
            payable(_buyer).transfer(msg.value - requiredEtherAmount);
        }

        emit EtherTradeExecuted(_seller, _buyer, _tokenAmount, msg.value);
    }
}