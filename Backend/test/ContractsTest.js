const { expect } = require("chai");
const { ethers } = require("hardhat");
require("@nomicfoundation/hardhat-chai-matchers");

// `npx hardhat test` Pour lancer les tests

describe("IdentityRegistry", function () {
    let identityRegistry;
    let deployer, user;

    beforeEach(async function () {
        [deployer, user] = await ethers.getSigners();
        const IdentityRegistry = await ethers.getContractFactory("IdentityRegistry");
        identityRegistry = await IdentityRegistry.deploy(deployer.address);
    });

    it("should allow updating KYC status", async function () {
        await identityRegistry.updateKycStatus(user.address, true);
        expect(await identityRegistry.getKycStatus(user.address)).to.equal(true);
    });
    
});

describe("Compliance", function () {
    let compliance;
    let identityRegistry;
    let deployer, user;

    beforeEach(async function () {
        [deployer, user] = await ethers.getSigners();
        const IdentityRegistry = await ethers.getContractFactory("IdentityRegistry");
        identityRegistry = await IdentityRegistry.deploy(deployer.address);

        const Compliance = await ethers.getContractFactory("Compliance");
        compliance = await Compliance.deploy(identityRegistry.target, deployer.address);
    });

    it("should correctly identify non-compliant transactions", async function () {
        await identityRegistry.updateKycStatus(deployer.address, true);
        await identityRegistry.updateKycStatus(user.address, false); 
        expect(await compliance.isTransactionCompliant(deployer.address, user.address, 100)).to.equal(false);
    });
    
});

describe("TokenRegistry", function () {
    let tokenRegistry;
    let deployer, user;

    beforeEach(async function () {
        [deployer, user] = await ethers.getSigners();
        const TokenRegistry = await ethers.getContractFactory("TokenRegistry");
        tokenRegistry = await TokenRegistry.deploy(deployer.address);
    });

    it("should allow owner to register a new token", async function () {
        const tx = await tokenRegistry.registerToken("TokenA", "TKA", user.address);
        await tx.wait();
        expect(await tokenRegistry.isTokenRegistered(user.address)).to.equal(true);
    });

    it("should emit an event when a new token is registered", async function () {
        await expect(tokenRegistry.registerToken("TokenB", "TKB", user.address))
            .to.emit(tokenRegistry, "TokenRegistered")
            .withArgs("TokenB", "TKB", user.address);
    });
});


describe("AssetTokenization", function () {
    let assetTokenization, identityRegistry, compliance, tokenRegistry;
    let deployer, user;

    beforeEach(async function () {
        [deployer, user] = await ethers.getSigners();
        
        // Suppose que vous avez déjà déployé IdentityRegistry, Compliance, et TokenRegistry
        // et que vous les instanciez ici.
        identityRegistry = await ethers.getContractAt("IdentityRegistry", identityRegistryAddress);
        compliance = await ethers.getContractAt("Compliance", complianceAddress);
        tokenRegistry = await ethers.getContractAt("TokenRegistry", tokenRegistryAddress);
        
        const AssetTokenization = await ethers.getContractFactory("AssetTokenization");
        assetTokenization = await AssetTokenization.deploy(identityRegistry.address, compliance.address, tokenRegistry.address, deployer.address);
        await assetTokenization.deployed();
    });

    it("should emit a TokenCreated event on token creation", async function () {
        await expect(assetTokenization.createToken("TestToken", "TST"))
            .to.emit(assetTokenization, "TokenCreated")
            .withArgs(/* L'adresse du token créé, le nom, et le symbole. Les valeurs exactes dépendront de l'implémentation de votre contrat */);
    });
});

describe("Trading", function () {
    let trading, compliance, tokenRegistry;
    let deployer, seller, buyer, tokenAddress;

    beforeEach(async function () {
        [deployer, seller, buyer] = await ethers.getSigners();
        
        // Instanciation des contrats Compliance et TokenRegistry
        compliance = await ethers.getContractAt("Compliance", complianceAddress);
        tokenRegistry = await ethers.getContractAt("TokenRegistry", tokenRegistryAddress);
        
        // Adresse de l'USDT supposée déjà définie
        const usdtAddress = "0x..."; // Supposé connu
        
        const Trading = await ethers.getContractFactory("Trading");
        trading = await Trading.deploy(usdtAddress, compliance.address, tokenRegistry.address, deployer.address);
        await trading.deployed();

        // Supposons que tokenAddress est l'adresse d'un token déjà déployé et enregistré
    });

    it("should emit a TradeExecuted event on trade execution", async function () {
        // Ce test dépend de l'état initial et de l'environnement de test spécifique,
        // par exemple, l'enregistrement des adresses et l'approbation des transferts.
        await expect(trading.executeTrade(tokenAddress, seller.address, buyer.address, 100, 100))
            .to.emit(trading, "TradeExecuted")
            .withArgs(seller.address, buyer.address, tokenAddress, 100, 100);
    });

    // Ajouter un test similaire pour EtherTradeExecuted si nécessaire
});

describe("LiquidityPool", function () {
    let liquidityPool, usdtToken;
    let deployer, user;

    beforeEach(async function () {
        [deployer, user] = await ethers.getSigners();
        
        // Supposons que usdtToken est déjà déployé et son adresse est connue
        usdtToken = await ethers.getContractAt("IERC20", usdtTokenAddress);
        
        const LiquidityPool = await ethers.getContractFactory("LiquidityPool");
        liquidityPool = await LiquidityPool.deploy(usdtToken.address, tradingContractAddress, deployer.address);
        await liquidityPool.deployed();
    });

    it("should emit LiquidityAdded event on USDT liquidity addition", async function () {
        const addAmount = ethers.utils.parseEther("100");
        // Supposons que le user approuve déjà liquidityPool pour le montant spécifié
        await expect(liquidityPool.connect(user).addUsdtLiquidity(addAmount))
            .to.emit(liquidityPool, "LiquidityAdded")
            .withArgs(user.address, addAmount, true);
    });

    it("should emit LiquidityRemoved event on USDT liquidity removal", async function () {
        const removeAmount = ethers.utils.parseEther("50");
        // Assurez-vous que le user a suffisamment de liquidité avant de retirer
        await expect(liquidityPool.connect(user).removeUsdtLiquidity(removeAmount))
            .to.emit(liquidityPool, "LiquidityRemoved")
            .withArgs(user.address, removeAmount, true);
    });

    // Ajouter des tests similaires pour les opérations de liquidité en Ether
});

describe("Lending", function () {
    let lending, borrower, lender;
    let compliance, tokenRegistry, liquidityPool;

    beforeEach(async function () {
        [lender, borrower] = await ethers.getSigners();
        
        // Supposons que les contrats compliance, tokenRegistry, et liquidityPool sont déjà déployés
        compliance = await ethers.getContractAt("Compliance", complianceAddress);
        tokenRegistry = await ethers.getContractAt("TokenRegistry", tokenRegistryAddress);
        liquidityPool = await ethers.getContractAt("LiquidityPool", liquidityPoolAddress);

        const Lending = await ethers.getContractFactory("Lending");
        lending = await Lending.deploy(compliance.address, tokenRegistry.address, liquidityPool.address, lender.address);
        await lending.deployed();
    });

    it("should emit LoanCreated event on loan creation", async function () {
        const loanAmount = ethers.utils.parseEther("100");
        const interestRate = 10; // 10% par exemple
        
        await expect(lending.connect(lender).createLoan(borrower.address, loanAmount, interestRate))
            .to.emit(lending, "LoanCreated")
            .withArgs(borrower.address, loanAmount, interestRate, /* startTime peut être difficile à prévoir exactement */);
    });

    it("should emit LoanRepaid event on loan repayment", async function () {
        const loanAmount = ethers.utils.parseEther("100");
        const interestRate = 10; // Supposons que ce prêt existe déjà

        // Le test devra s'assurer que borrower a suffisamment d'Ether pour rembourser le prêt
        await expect(lending.connect(borrower).repayLoan(borrower.address, {value: loanAmount /* Plus les intérêts calculés */}))
            .to.emit(lending, "LoanRepaid")
            .withArgs(borrower.address, /* Le montant total remboursé incluant les intérêts */);
    });

    // Vous devrez peut-être adapter ces tests à la logique spécifique de votre contrat, en particulier pour gérer les montants de prêt et les taux d'intérêt.
});



