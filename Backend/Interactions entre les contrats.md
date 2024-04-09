# Smart Contract Interactions

## IdentityRegistry.sol
- Gère le statut KYC des utilisateurs; utilisé notamment par `Compliance.sol`.

## Compliance.sol
- Utilise → `IdentityRegistry.sol` pour obtenir le statut KYC pour la conformité des transactions.

## TokenRegistry.sol
- Pas d'interactions sortantes; utilisé par d'autres contrats pour l'enregistrement et voir les informations des tokens.

## AssetTokenization.sol
- Utilise → `TokenRegistry.sol` pour enregistrer des tokens.
- Utilise → `Compliance.sol` pour vérifier la conformité de création.
- Utilise → `IdentityRegistry.sol` (via Compliance) pour vérifier le statut KYC.

## Trading.sol
- Utilise → `TokenRegistry.sol` pour vérifier l'enregistrement des tokens.
- Utilise → `Compliance.sol` pour vérifier la conformité des transactions.

## LiquidityPool.sol
- Est appelé par → `Trading.sol` pour fournir la liquidité nécessaire aux échanges.
- Est appelé par → `Lending.sol` pour fournir la liquidité nécessaire aux prêts.

## Lending.sol
- Utilise → `Compliance.sol` pour vérifier la conformité des prêts.
- Utilise → `TokenRegistry.sol` pour les informations sur les tokens.
- Utilise → `LiquidityPool.sol` pour obtenir des fonds pour les prêts.
