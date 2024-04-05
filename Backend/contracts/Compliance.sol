// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.8.25;

import "./IdentityRegistry.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Contrat de conformité 
/// @notice Effectue des vérifications de conformité basées sur le statut KYC provenant du contrat IdentityRegistry.sol
contract Compliance is Ownable {

    ///@notice On appelle le contrat IdentityRegistry
    /// @dev Instance du contrat IdentityRegistry
    IdentityRegistry private identityRegistry;

    ///@notice Événement qui vient signaler qu'une transaction a été bloquée 
    event TransactionBlocked(address indexed from, address indexed to, uint256 amount);

    /// @notice Constructeur définissant l'instance d'IdentityRegistry. Ceci dans le but d'accèder aux informations KYC des utilisateurs
    /// @param _identityRegistryAddress L'adresse du contrat IdentityRegistry
    constructor(address _identityRegistryAddress, address initialOwner) Ownable(initialOwner) {
        identityRegistry = IdentityRegistry(_identityRegistryAddress);
    }

    /// @notice Vérifie la conformité d'une transaction
    /// @param from L'adresse de l'expéditeur
    /// @param to L'adresse du destinataire
    /// @param amount Le montant de la transaction.
    /// @return Vrai si la transaction est conforme, faux sinon
    function checkCompliance(address from, address to, uint256 amount) external returns (bool) {
        bool senderKyc = identityRegistry.getKycStatus(from);
        bool receiverKyc = identityRegistry.getKycStatus(to);

        if (!senderKyc || !receiverKyc) {
            emit TransactionBlocked(from, to, amount);
            return false;
        }
        return true;
    }
}
