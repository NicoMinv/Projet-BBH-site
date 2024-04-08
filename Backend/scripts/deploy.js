const hre = require("hardhat");

async function main() {
  console.log('Début du déploiement');
  const [deployer] = await hre.ethers.getSigners();
  console.log("Déploiement des contrats avec le compte:", deployer.address);

  // Déploiement de IdentityRegistry
  const IdentityRegistry = await hre.ethers.getContractFactory("IdentityRegistry");
  const identityRegistry = await IdentityRegistry.deploy();
  await identityRegistry.deployed();
  console.log("IdentityRegistry déployé à:", identityRegistry.address);

  // Déploiement de TokenRegistry
  const TokenRegistry = await hre.ethers.getContractFactory("TokenRegistry");
  const tokenRegistry = await TokenRegistry.deploy();
  await tokenRegistry.deployed();
  console.log("TokenRegistry déployé à:", tokenRegistry.address);

  // Déploiement de Compliance
  const Compliance = await hre.ethers.getContractFactory("Compliance");
  const compliance = await Compliance.deploy(identityRegistry.address);
  await compliance.deployed();
  console.log("Compliance déployé à:", compliance.address);

  // Ici, ajoutez le déploiement de AssetTokenization et Lending si nécessaire, en passant les bonnes adresses.

  // Déploiement de Trading, LiquidityPool, etc., avec mise à jour des références si nécessaire.
  
  // Note: Assurez-vous de déployer et d'initialiser `Lending` et `AssetTokenization` avec les bonnes adresses avant de continuer.
  
  // Exemple pour `Trading` et `LiquidityPool`. Ajustez selon votre logique de déploiement.

  // Continuez le déploiement et la mise à jour des références ici...
}

main().then(() => process.exit(0)).catch((error) => {
  console.error(error);
  process.exit(1);
});
