// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.8.25;

import "@openzeppelin/contracts/access/Ownable.sol";


    /// @title Registre des Tokens d'Actifs sur la plateforme
contract TokenRegistry is Ownable {

    // Structure pour stocker les informations sur chaque token.
    struct TokenInfo {
        string name;
        string symbol;
        address tokenAddress;
    }

    ///@notice Tableau pour stocker les informations des tokens crées.
    /// @dev Array pour stocker les informations de tous les tokens

    TokenInfo[] private tokens;

    /// @notice Tableau pour retrouver le token via son adresse.
    /// @dev Mapping pour retrouver l'index d'un token dans le tableau `tokens` via son adresse.
    mapping(address => uint256) private tokenIndex;

    /// @notice Événement émis lorsqu'un nouveau token est enregistré
    event TokenRegistered(string name, string symbol, address indexed tokenAddress);


    constructor(address initialOwner) Ownable(initialOwner) {}
    
    /// @notice Enregistre un nouveau token dans le registre
    /// @param _name Le nom du token.
    /// @param _symbol Le symbole du token.
    /// @param _tokenAddress L'adresse du contrat du token
    function registerToken(string memory _name, string memory _symbol, address _tokenAddress) external onlyOwner {
        require(_tokenAddress != address(0), unicode"TokenRegistry: adresse du token ne peut pas être l'adresse zéro.");
        require(tokenIndex[_tokenAddress] == 0, unicode"TokenRegistry: token déjà enregistré.");

        tokens.push(TokenInfo({
            name: _name,
            symbol: _symbol,
            tokenAddress: _tokenAddress
        }));

        // L'index 0 est réservé pour indiquer qu'un token n'est pas enregistré, donc on ajoute 1 pour éviter la confusion.
        // On ne pourrait pas distinguer un token non enregistré (qui retournerait aussi 0) d'un token situé à l'index 0 du tableau.
        tokenIndex[_tokenAddress] = tokens.length;

        emit TokenRegistered(_name, _symbol, _tokenAddress);
    }

    /// @notice Renvoie les informations d'un token enregistré 
    /// @param _tokenAddress L'adresse du token.
    /// @return name Le nom du token
    /// @return symbol Le symbole du token
    /// @return tokenAddress L'adresse du contrat du token.
    function getTokenInfo(address _tokenAddress) external view returns (string memory name, string memory symbol, address tokenAddress) {
        uint256 index = tokenIndex[_tokenAddress];
        require(index != 0, unicode"TokenRegistry: token non enregistré.");

        TokenInfo storage token = tokens[index - 1];
        return (token.name, token.symbol, token.tokenAddress);
    }

    /// @notice Fonction qui renvoie le nombre total de tokens enregistrés
    /// @return nombre de tokens enregistrés
    function totalTokens() external view returns (uint256) {
        return tokens.length;
    }

    /// @notice Vérifie si un token est enregistré dans le registre. Fonction très importante pour les contrats qui doivent trade le token
    /// @param _tokenAddress L'adresse du token à vérifier
    /// @return bool True si le token est enregistré, false sinon.
    function isTokenRegistered(address _tokenAddress) external view returns (bool) {
        return tokenIndex[_tokenAddress] != 0;
    }
}
