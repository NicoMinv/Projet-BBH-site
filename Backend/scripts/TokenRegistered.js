const hre = require("hardhat");

async function main() {
    const provider = hre.ethers.provider;
    const tokenRegistryAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
    const TokenRegistry = await hre.ethers.getContractFactory("TokenRegistry");
    const tokenRegistry = TokenRegistry.attach(tokenRegistryAddress).connect(provider);

    // On vient écouter l'évenement TokenRegistered
    tokenRegistry.on("TokenRegistered", (name, symbol, tokenAddress) => {
        console.log(`TokenRegistered: name=${name}, symbol=${symbol}, tokenAddress=${tokenAddress}`);
    });

    // Attente de l'événement
    console.log("En attente d'événements...");

    // Temps arbitraire du script 
    await new Promise(resolve => setTimeout(resolve, 100000)); 
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
