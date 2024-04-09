const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying LiquidityPool with the account:", deployer.address);

  // Il faut récuperer l'adresse de Trading ici :
  const tradingAddress = "0x9a676e781a523b5d0c0e43731313a708cb607508"; 

  // On va fixer ici l'adresse de l'usdt. Ici c'est l'adresse USDT de Ethereum (Mainnet)
  const usdtAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";

  // Deploy LiquidityPool
  // Dépend de USDT et Trading
  const LiquidityPool = await ethers.getContractFactory("LiquidityPool");
  const liquidityPool = await LiquidityPool.deploy(usdtAddress, tradingAddress, deployer.address);
  console.log("LiquidityPool deployed to:", liquidityPool.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
