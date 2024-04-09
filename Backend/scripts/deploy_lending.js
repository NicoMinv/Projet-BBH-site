const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying Lending with the account:", deployer.address);

    //On récupere ici toutes nos adresses :
    const complianceAddress = "0xb7f8bc63bbcad18155201308c8f3540b07f84f5e"; 
    const tokenRegistryAddress = "0x8a791620dd6260079bf849dc5567adc3f2fdc318"; 
    const liquidityPoolAddress = "0x0b306bf915c4d645ff596e518faf3f9669b97016"; 

  // Deploy Lending
  // Dépend de Compliance, TokenRegistry, LiquidityPool
  const Lending = await ethers.getContractFactory("Lending");
  const lending = await Lending.deploy(complianceAddress, tokenRegistryAddress, liquidityPoolAddress, deployer.address);
  console.log("Lending deployed to:", lending.address);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


