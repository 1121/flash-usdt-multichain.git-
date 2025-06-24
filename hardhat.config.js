require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    polygon: {
      url: "https://polygon-rpc.com",
      accounts: [process.env.PRIVATE_KEY]
    },
    bsc: {
      url: "https://bsc-dataseed.binance.org/",
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};

