### Explication des contrats 


## IdentityRegistry.sol
**Appelle Ownable de la bibliothèque OpenZeppelin**

Ce contrat est responsable de la gestion des identités des utilisateurs. Il stocke les informations d'identification et de vérification (du KYC notamment). Il fournit des méthodes pour interagir avec ces données. Il va nous servir de pont avec des services KYC tiers, enregistrant des attestations de vérification KYC déjà faites off-chain.

**Fonctions clés :**
- Enregistrement d'un nouvel utilisateur avec des détails de base.
- Stockage des attestations de KYC, sous forme de hachages par exemple. Il faut juste que ça reste privé.
- Fonctions pour récupérer le statut de KYC d'un utilisateur.
- Fonctions pour mettre à jour le statut de KYC d'un utilisateur (On peut à notre guise valider ou invalider un utilisateur). C’est ici où on aurait dû mettre en place l’ERC-3643 et la vérification onchain ID avec l’ERC-725-735.

**Il y a des événements pour signaler les changements de statut KYC. Aussi pour la création. Globalement les événements dont je vais parler dans tous les contrats, font office d’API pour notre front !**

## Compliance.sol
**Appelle Ownable de la bibliothèque OpenZeppelin**

Ce contrat fonctionnerait conjointement avec IdentityRegistry.sol pour s'assurer que les transactions et les activités des utilisateurs sur notre plateforme sont conformes aux réglementations. Il va restreindre les transactions en fonction du statut KYC des utilisateurs notamment.

**Fonctions clés :**

- Vérification des transactions pour s'assurer qu'elles sont effectuées par des utilisateurs ayant passé le KYC.
- Fonctions pour gérer des listes noires ou blanches d'utilisateurs, régulant ainsi qui peut acheter ou vendre certains actifs.
- Possibilité d'interrompre les transactions en cas de non-conformité détectée.
- Intégration avec IdentityRegistry.sol pour obtenir des détails sur la conformité des utilisateurs.

Événements pour signaler les infractions de conformité et les actions correctives prises.

## AssetTokenization.sol

Pour le mvp, j’ai simplifié AssetTokenization (devenu AssetTokenization_v2.sol) car le clonage ne marchait pas bien. Ce contrat la va :
A chaque appel de la fonction createToken, créer un nouveau contrat ERC20  et le déployer avec le nom et le symbole spécifiés 
Apres la création du token,son adresse ainsi que son nom et symbole sont enregistrés dans TokenRegistry.


## AssetTokenization_v2.sol
**Appelle : Ownable, Clones et ERC20 de la bibliothèque OpenZeppelin**

Ce contrat va préparer un modèle de token. C’est un moule, qui va pouvoir créer un contrat copie du contrat qui va servir de token pour le projet.

**Exemple :**

Un marchand de bien veut tokeniser son projet : Le marchand de biens se connecte à notre plateforme et fournit les détails nécessaires pour tokeniser son projet immobilier, comme le nom du projet, le symbole du token, et d'autres informations pertinentes. 
Les étapes de création du token pour le projet : En utilisant la fonction `createToken` du contrat AssetTokenization, un nouveau token est créé spécifiquement pour le projet immobilier du marchand. Le contrat va créer un clone qui va créer une copie de contrat AssetToken. L'adresse de ce contrat modèle est `tokenImplementation`.

Le nouveau contrat cloné (token spécifique au projet) est initialisé avec le nom et le symbole fournis par le marchand de bien. Cette étape configure le token pour le rendre unique au projet du marchand. Le token est enregistré et répertorié dans le contrat TokenRegistry.sol.

L'adresse du nouveau token créé est enregistrée dans la plateforme, associant le token au projet du marchand. Cela permet aux investisseurs de trouver et d'investir dans le token. 
Les investisseurs peuvent maintenant acheter des tokens du projet immobilier, représentant une part de l'investissement dans le projet. Le marchand de biens peut utiliser les fonds collectés pour financer le développement du projet.

## TokenRegistry.sol
**Contrat qui maintient un registre des tokens émis et permet leur découverte et suivi.**

Ce contrat permet à l'administrateur (le propriétaire du contrat, nous) d'enregistrer des tokens avec leur nom, symbole, et adresse. Il offre également des fonctionnalités pour récupérer les informations d'un token enregistré par son adresse et pour connaître le nombre total de tokens enregistrés. 
Le marchand de biens devra soumettre son projet à notre plateforme, et après validation, on pourra procéder à la création du token en son nom.

L'usage de ce registre permettra de faciliter la découverte et le suivi des différents tokens émis sur la plateforme. 
Ce contrat est appelé par les contrats Trading.sol, etc., pour bien vérifier que le jeton existe lors de la transaction.

## Trading.sol
**Ce contrat est conçu pour faciliter les échanges de tokens entre vendeurs et acheteurs.**

Une fois que le jeton est créé avec AssetTokenization.sol, il est proposé sur la plateforme.
Avec le contrat Trading.sol, les utilisateurs peuvent acheter ou échanger le jeton du nouveau projet contre de l'Ether ou des USDT (pour l’instant). Les utilisateurs doivent accepter : ‘l'autorisation des transactions’ pour que l'échange se fasse lorsqu’ils connectent leur Metamask.

En principe, ils verront les détails de l'échange (comme le prix et les frais), et pourront confirmer leurs achats. 
De notre côté, avant de permettre l'échange de tokens contre des USDT ou ethers, le contrat Trading appelle la fonction `checkCompliance` sur le contrat Compliance pour s'assurer que la transaction respecte les règles de conformité. (en gros le KYC)

**Pour le taux de change, j’ai utilisé de manière différentes :**

- Usdt -> Jeton de projet : Dans ce scénario, le vendeur et l’acheteur s'accordent sur une quantité de tokens à échanger et la quantité correspondante d'USDT.
- Ethers -> Jeton de projet : Le montant d'Ether nécessaire pour l'achat est calculé sur la base d'un prix fixé (`tokenPriceInEther`). L'acheteur envoie l'Ether directement avec l'appel de transaction. Si le montant envoyé est supérieur au montant requis, l'excédent est retourné à l'acheteur. Ensuite, l'Ether est transféré au vendeur, et les tokens sont transférés de l'adresse du vendeur à celle de l'acheteur.

## LiquidityPool.sol
**Ce contrat est conçu pour être le cœur financier de notre plateforme, permettant aux utilisateurs de contribuer et de retirer des fonds au pool.**

Ce contrat permet aux utilisateurs de déposer de l'USDT ou de l'Ether, augmentant ainsi la réserve de fonds disponibles pour les futures opérations de la plateforme. Les dépôts sont suivis individuellement, assurant une transparence totale. Les utilisateurs peuvent retirer leurs contributions à tout moment, ce qui rend le pool flexible et accessible.

Le contrat interagit directement avec nos contrats de trading et de prêt, fournissant la liquidité nécessaire pour exécuter des transactions et accorder des prêts. 
En tant qu’utilisateur, on peut envoyer et récupérer ce qu’on a envoyé dans le pool.

Nous, les owners du contrat, on peut assez librement utiliser le pool pour accorder des prêts par exemple.

## Lending.sol
**Le contrat Lending.sol est conçu pour gérer les prêts sur notre plateforme, agissant comme un pont entre les investisseurs et les emprunteurs qui veulent financer leur projet.**

**Création de prêt :** Le contrat permet au propriétaire (nous, en tant qu'admins de la plateforme) de créer un prêt pour un emprunteur spécifique. Ce processus nécessite la spécification du montant principal du prêt, du taux d'intérêt, et de l'identification de l'emprunteur. Avant de finaliser le prêt, le contrat effectue une vérification de conformité via le contrat Compliance.sol pour s'assurer que l'emprunteur répond à toutes les exigences réglementaires.

**Financement des Prêts :** Une fois que le prêt est approuvé, les fonds sont transférés à l'emprunteur directement depuis le pool de liquidité (LiquidityPool.sol), ce qui garantit que les fonds sont disponibles immédiatement pour l'emprunteur. Ce mécanisme renforce l'efficacité du système de prêt. On se sert de l’argent déjà disponible dans le pool.

**Remboursement de Prêt :** L'emprunteur peut rembourser le prêt directement au contrat. Si le montant envoyé dépasse le montant dû, l'excédent est retourné à l'emprunteur. Le contrat vérifie automatiquement si le montant total dû est remboursé et marque le prêt comme "remboursé" une fois le processus terminé.

**Calcul des Intérêts :** Le contrat inclut une fonctionnalité de calcul des intérêts basée sur le taux d'intérêt annuel convenu et la durée depuis le début du prêt. Cela permet de déterminer de manière précise le montant total que l'emprunteur doit rembourser.

**Pour notre MVP, on peut fixer le taux je pense que c’est plus simple pour l’instant.**
