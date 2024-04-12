const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  // On vérifie ici que l'adresse du déployeur est celle qu'on veut utiliser
  if(deployer.address !== "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266") {
    throw new Error("Le compte du déployeur n'est pas celui attendu.");
  }
  
  //--------------------------------------------------------Deploy IdentityRegistry ----------------------------------------------------------//

  // Deploy IdentityRegistry avec l'adresse du déployeur comme owner initial
  const IdentityRegistry = await ethers.getContractFactory("IdentityRegistry");
  const identityRegistry = await IdentityRegistry.deploy(deployer.address);
  console.log("IdentityRegistry deployed to:", identityRegistry.target);


  //--------------------------------------------------------Deploy TokenRegistry----------------------------------------------------------//

  // Deploy TokenRegistry
  const TokenRegistry = await ethers.getContractFactory("TokenRegistry");
  const tokenRegistry = await TokenRegistry.deploy(deployer.address);
  console.log("TokenRegistry deployed to:", tokenRegistry.target);


  //--------------------------------------------------------Deploy Compliance ----------------------------------------------------------//
  
  // Il faut récuperer l'adresse de IdentityRegistry ici :
  const identityRegistryAddress = identityRegistry.target; 

  // Deploy Compliance, dépend de IdentityRegistry
  const Compliance = await ethers.getContractFactory("Compliance");
  const compliance = await Compliance.deploy(identityRegistryAddress, deployer.address);
  console.log("Compliance deployed to:", compliance.target);


  //--------------------------------------------------------Deploy AssetTokenization ----------------------------------------------------------//

  //On récupere ici toutes nos adresses :
  const complianceAddress = compliance.target; 
  const tokenRegistryAddress = tokenRegistry.target; 

  // Deploy AssetTokenization, dépend de IdentityRegistry, Compliance, et TokenRegistry
  const AssetTokenization = await ethers.getContractFactory("AssetTokenization");
  const assetTokenization = await AssetTokenization.deploy(identityRegistryAddress, complianceAddress, tokenRegistryAddress, deployer.address);
  console.log("AssetTokenization deployed to:", assetTokenization.target);


  //--------------------------------------------------------Deploy Trading ----------------------------------------------------------//

  //On récupere ici toutes nos adresses :
    const usdtAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7"; // On va fixer ici l'adresse de l'usdt. Ici c'est l'adresse USDT de Ethereum (Mainnet)

  // Deploy Trading
  // Dépend de USDT, Compliance, TokenRegistry
  const Trading = await ethers.getContractFactory("Trading");
  const trading = await Trading.deploy(usdtAddress, complianceAddress, tokenRegistryAddress, deployer.address);
  console.log("Trading deployed to:", trading.target);


  //--------------------------------------------------------Deploy LiquidityPool ----------------------------------------------------------//

  // Il faut récuperer l'adresse de Trading ici :
  const tradingAddress = trading.target; 

  // Deploy LiquidityPool
  // Dépend de USDT et Trading
  const LiquidityPool = await ethers.getContractFactory("LiquidityPool");
  const liquidityPool = await LiquidityPool.deploy(usdtAddress, tradingAddress, deployer.address);
  console.log("LiquidityPool deployed to:", liquidityPool.target);


  //--------------------------------------------------------Deploy Lending ----------------------------------------------------------//
    
  // On récupère l'adresse de LiquidityPool ici :
  const liquidityPoolAddress = liquidityPool.target;

  // Deploy Lending
  // Dépend de Compliance, TokenRegistry, LiquidityPool
  const Lending = await ethers.getContractFactory("Lending");
  const lending = await Lending.deploy(complianceAddress, tokenRegistryAddress, liquidityPoolAddress, deployer.address);
  console.log("Lending deployed to:", lending.target);
  
}

// Gestion des erreurs
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
