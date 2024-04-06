const hre = require("hardhat");

async function main() {
  console.log('start')
  // Récupère les signers
  const [deployer] = await hre.ethers.getSigners();
  
  console.log("Deploying contracts with the account:", deployer.address);

  // Déploiement de IdentityRegistry
  const IdentityRegistry = await hre.ethers.getContractFactory("IdentityRegistry");
  console.log('Ident', IdentityRegistry)
  const identityRegistry = await IdentityRegistry.deploy(deployer.address);

  // Déploiement de Compliance
  const Compliance = await hre.ethers.getContractFactory("Compliance");
  const compliance = await Compliance.deploy(identityRegistry.target, deployer.address);
  console.log("Compliance deployed to:", compliance.address);

  // Déploiement de TokenRegistry
  const TokenRegistry = await hre.ethers.getContractFactory("TokenRegistry");
  const tokenRegistry = await TokenRegistry.deploy(deployer.address);
  console.log("TokenRegistry deployed to:", tokenRegistry.address);

 
  const usdtAddress = "adresse_du_token_USDT"; // A voir si vraiment nécessaire pour le MVP

  // Déploiement de Trading
  const Trading = await hre.ethers.getContractFactory("Trading");
  const trading = await Trading.deploy(usdtAddress, compliance.address, tokenRegistry.address, deployer.address);
  console.log("Trading deployed to:", trading.address);


  // Déploiement de LiquidityPool
  const LiquidityPool = await hre.ethers.getContractFactory("LiquidityPool");
  const liquidityPool = await LiquidityPool.deploy(usdtAddress, trading.address, lending.address, deployer.address);
  console.log("LiquidityPool deployed to:", liquidityPool.address);
}

main().then(() => process.exit(0)).catch((error) => {
  console.error(error);
  process.exit(1);
});
