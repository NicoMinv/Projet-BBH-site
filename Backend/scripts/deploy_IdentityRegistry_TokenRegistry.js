const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  // On vérifie ici que l'adresse du déployeur est celle qu'on veut utiliser
  if(deployer.address !== "0x1A66433B55341A25278Fa96E13eB5EDBe2c64F30") {
    throw new Error("Le compte du déployeur n'est pas celui attendu.");
  }
  
  // Deploy IdentityRegistry avec l'adresse du déployeur comme owner initial
  const IdentityRegistry = await ethers.getContractFactory("IdentityRegistry");
  const identityRegistry = await IdentityRegistry.deploy(deployer.address);
  console.log("IdentityRegistry deployed to:", identityRegistry.address);


  // Deploy TokenRegistry
  const TokenRegistry = await ethers.getContractFactory("TokenRegistry");
  const tokenRegistry = await TokenRegistry.deploy(deployer.address);
  console.log("TokenRegistry deployed to:", tokenRegistry.address);



}

// Gestion des erreurs
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
