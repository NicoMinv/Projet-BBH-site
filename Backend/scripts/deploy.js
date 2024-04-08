const { ethers } = require("hardhat");

async function main() {

  // Deploy IdentityRegistry
  const IdentityRegistry = await ethers.getContractFactory("IdentityRegistry");
  const identityRegistry = await IdentityRegistry.deploy();
  await identityRegistry.deployed();
  console.log("IdentityRegistry deployed to:", identityRegistry.address);

  // Deploy TokenRegistry
  const TokenRegistry = await ethers.getContractFactory("TokenRegistry");
  const tokenRegistry = await TokenRegistry.deploy();
  await tokenRegistry.deployed();
  console.log("TokenRegistry deployed to:", tokenRegistry.address);

  // Deploy Compliance
  // Dépend de IdentityRegistry
  const Compliance = await ethers.getContractFactory("Compliance");
  const compliance = await Compliance.deploy(identityRegistry.address);
  await compliance.deployed();
  console.log("Compliance deployed to:", compliance.address);


  // On va rajouter ici une adresse d'implementation de token pour AssetTokenization, un token test qui va faire office de projet B.
  const tokenImplementationAddress = "adresse_du_contrat_d'implémentation_du_token_projet_B";

  // Deploy AssetTokenization, dépend de IdentityRegistry, Compliance, et TokenRegistry
  const AssetTokenization = await ethers.getContractFactory("AssetTokenization");
  const assetTokenization = await AssetTokenization.deploy(tokenImplementationAddress, identityRegistry.address, compliance.address, tokenRegistry.address);
  await assetTokenization.deployed();
  console.log("AssetTokenization deployed to:", assetTokenization.address);

  // On va fixer ici l'adresse de l'usdt. Ici c'est l'adresse USDT de Ethereum (Mainnet)
  const usdtAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";

  // Deploy Trading
  // Dépend de USDT, Compliance, TokenRegistry
  const Trading = await ethers.getContractFactory("Trading");
  const trading = await Trading.deploy(usdtAddress, compliance.address, tokenRegistry.address);
  await trading.deployed();
  console.log("Trading deployed to:", trading.address);

  // Deploy LiquidityPool
  // Dépend de USDT et Trading
  const LiquidityPool = await ethers.getContractFactory("LiquidityPool");
  const liquidityPool = await LiquidityPool.deploy(usdtAddress, trading.address);
  await liquidityPool.deployed();
  console.log("LiquidityPool deployed to:", liquidityPool.address);

  // Deploy Lending
  // Dépend de Compliance, TokenRegistry, LiquidityPool
  const Lending = await ethers.getContractFactory("Lending");
  const lending = await Lending.deploy(compliance.address, tokenRegistry.address, liquidityPool.address);
  await lending.deployed();
  console.log("Lending deployed to:", lending.address);

}

// Gestion des erreurs
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
