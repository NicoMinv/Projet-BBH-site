// scripts/createToken.js

async function main() {
    // Adresse du contrat AssetTokenization déployé
    const assetTokenizationAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";

    // Création d'une instance 
    const AssetTokenization = await ethers.getContractFactory("AssetTokenization");
    const assetTokenization = await AssetTokenization.attach(assetTokenizationAddress);

    // Paramètres pour la création du token
    const tokenName = "Projet 4";
    const tokenSymbol = "ALYRA";

    // Appel de la fonction createToken
    console.log(`Création du token ${tokenName} avec le symbole ${tokenSymbol}...`);
    const tx = await assetTokenization.createToken(tokenName, tokenSymbol);
    await tx.wait();

    console.log(`Token ${tokenName} créé avec succès.`);
    console.log(`${tokenName} deployed to:`, assetTokenization.target);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
