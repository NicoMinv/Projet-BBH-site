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





