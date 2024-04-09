const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying Trading with the account:", deployer.address);


    //On récupere ici toutes nos adresses :
    const complianceAddress = "0xb7f8bc63bbcad18155201308c8f3540b07f84f5e"; 
    const tokenRegistryAddress = "0x8a791620dd6260079bf849dc5567adc3f2fdc318"; 
    const usdtAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7"; // On va fixer ici l'adresse de l'usdt. Ici c'est l'adresse USDT de Ethereum (Mainnet)

  // Deploy Trading
  // Dépend de USDT, Compliance, TokenRegistry
  const Trading = await ethers.getContractFactory("Trading");
  const trading = await Trading.deploy(usdtAddress, complianceAddress, tokenRegistryAddress, deployer.address);
  console.log("Trading deployed to:", trading.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


