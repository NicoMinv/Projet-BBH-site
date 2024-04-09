require("@nomicfoundation/hardhat-ethers");
require('dotenv').config(); 

const { SEPOLIA_INFURA_API_KEY, SEPOLIA_PRIVATE_KEY } = process.env;

module.exports = {
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${SEPOLIA_INFURA_API_KEY}`,
      accounts: [`0x${SEPOLIA_PRIVATE_KEY}`]
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.20",
        settings: { optimizer: { enabled: true, runs: 200 } },
      },
      {
        version: "0.8.19",
        settings: { optimizer: { enabled: true, runs: 200 } },
      },
      {
        version: "0.8.0",
        settings: { optimizer: { enabled: true, runs: 200 } },
      },
    ],
  },
};
