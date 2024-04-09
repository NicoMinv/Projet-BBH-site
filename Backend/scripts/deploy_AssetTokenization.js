const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying AssetTokenization with the account:", deployer.address);

    //On récupere ici toutes nos adresses :
  const identityRegistryAddress = "0x2279b7a0a67db372996a5fab50d91eaa73d2ebe6"; 
  const complianceAddress = "0xb7f8bc63bbcad18155201308c8f3540b07f84f5e"; 
  const tokenRegistryAddress = "0x8a791620dd6260079bf849dc5567adc3f2fdc318"; 
  const tokenImplementationAddress = "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199";

  // Deploy AssetTokenization, dépend de IdentityRegistry, Compliance, et TokenRegistry
  const AssetTokenization = await ethers.getContractFactory("AssetTokenization");
  const assetTokenization = await AssetTokenization.deploy(identityRegistryAddress, complianceAddress, tokenRegistryAddress, deployer.address);
  console.log("AssetTokenization deployed to:", assetTokenization.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


