const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying Compliance with the account:", deployer.address);

  // Il faut récuperer l'adresse de IdentityRegistry ici :
  const identityRegistryAddress = "0x2279b7a0a67db372996a5fab50d91eaa73d2ebe6"; 

  // Deploy Compliance, dépend de IdentityRegistry
  const Compliance = await ethers.getContractFactory("Compliance");
  const compliance = await Compliance.deploy(identityRegistryAddress, deployer.address);
  console.log("Compliance deployed to:", compliance.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});