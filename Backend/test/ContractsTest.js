const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TokenRegistry Tests", function () {
    let tokenRegistry;
    let deployer, addr1;

    beforeEach(async function () {
        // Récupère les comptes
        const [deployer, addr1] = await ethers.getSigners();
        // Déploie TokenRegistry
        const TokenRegistry = await ethers.getContractFactory("TokenRegistry");
        tokenRegistry = await TokenRegistry.deploy(deployer.address);
    });

    it("Should allow owner to register a new token", async function () {
        const tx = await tokenRegistry.registerToken("TokenA", "TKA", addr1.address);
        await tx.wait();

        expect(await tokenRegistry.isTokenRegistered(addr1.address)).to.be.true;
    });

    it("Should emit an event when a new token is registered", async function () {
        await expect(tokenRegistry.registerToken("TokenB", "TKB", addr1.address))
            .to.emit(tokenRegistry, "TokenRegistered")
            .withArgs("TokenB", "TKB", addr1.address);
    });
});

describe("IdentityRegistry and Compliance Tests", function () {
    let identityRegistry, compliance;
    let deployer, addr1;

    beforeEach(async function () {
        [deployer, addr1] = await ethers.getSigners();

        // Déploie IdentityRegistry
        const IdentityRegistry = await ethers.getContractFactory("IdentityRegistry");
        identityRegistry = await IdentityRegistry.deploy(deployer.address);

        // Déploie Compliance
        const Compliance = await ethers.getContractFactory("Compliance");
        compliance = await Compliance.deploy(identityRegistry.address, deployer.address);
    });

    it("Should update KYC status and check compliance accordingly", async function () {
        await identityRegistry.updateKycStatus(addr1.address, true);
        expect(await identityRegistry.getKycStatus(addr1.address)).to.be.true;

        // Assumant une fonction dans Compliance qui vérifie si une transaction est conforme
        // basée sur le statut KYC des adresses 'from' et 'to'.
        await expect(compliance.checkCompliance(deployer.address, addr1.address, 100)).to.be.true;
    });
});
