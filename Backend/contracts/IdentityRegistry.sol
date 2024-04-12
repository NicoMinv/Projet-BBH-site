// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.8.25;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Contrat de gestion des identités.
/// @notice Stocke et gère les statuts KYC pour les adresses des utilisateurs.

contract IdentityRegistry is Ownable {

    /// @notice Représente les informations d'identité vérifiées d'un utilisateur, telles que le statut KYC.
    /// @dev Structure pour stocker les informations d'identité d'un utilisateur.    
    struct Identity {
        bool isKycCompleted;
    }

    /// @notice Annonce la mise à jour du statut KYC d'un utilisateur, montrant si l'utilisateur a complété avec succès la procédure de vérification KYC.
    /// @dev Événement pour signaler une mise à jour du statut KYC d'un utilisateur.
    event KycStatusUpdated(address indexed user, bool isKycCompleted);

    /// @notice On associe l'adresse des utilisateurs à leurs identités.
    /// @dev Mapping pour associer les adresses utilisateur à leurs identités.
    mapping(address => Identity) private identities;


    // On spécifie le propriétaire initial du contrat.
    constructor(address initialOwner) Ownable(initialOwner) {
        // KYC automatique pour la personne qui déploie le contrat pour faciliter les tests. 
        identities[initialOwner].isKycCompleted = true;
        emit KycStatusUpdated(initialOwner, true);
    }

    /// @notice Enregistre ou met à jour le statut KYC d'un utilisateur. Cette fonction nous donne le droit de KYC quelqu'un ou de lui enlever son KYC.
    /// @param user L'adresse de l'utilisateur dont le statut KYC est mis à jour.
    /// @param isKycCompleted Le nouveau statut KYC de l'utilisateur. Booléan.
    function updateKycStatus(address user, bool isKycCompleted) external onlyOwner {
        identities[user].isKycCompleted = isKycCompleted;

    /// @notice Notifie la mise à jour du statut KYC d'un utilisateur.
        emit KycStatusUpdated(user, isKycCompleted); 
    }

    /// @notice Récupère le statut KYC d'un utilisateur
    /// @param user L'adresse de l'utilisateur pour lequel on souhaite vérifier le statut KYC.
    /// @return Le statut KYC de l'utilisateur
    function getKycStatus(address user) external view returns (bool) {
        return identities[user].isKycCompleted;
    }
}
