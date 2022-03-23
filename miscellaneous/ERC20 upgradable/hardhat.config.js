const resolve = require("path");
console.log("resolve--");
console.log(resolve.resolve);

const dotenvConfig =  require("dotenv");
require("@nomiclabs/hardhat-etherscan");


require("@nomiclabs/hardhat-ethers");
require('@openzeppelin/hardhat-upgrades');

dotenvConfig.config({ path: resolve.resolve(__dirname, "./.env") });
console.log(process.env.WALLET_PRIVATE_KEY);

const chainIds = {
  hardhat: 31337,
  rinkeby: 4,
  ropsten: 3,
};

// Ensure that we have all the environment variables we need.
let privateKey;
if (!process.env.PRIVATE_KEY) {
  throw new Error("Please set your PRIVATE_KEY in a .env file");
} else {
  privateKey = process.env.PRIVATE_KEY;
}

let infuraApiKey;
if (!process.env.INFURA_API_KEY) {
  throw new Error("Please set your INFURA_API_KEY in a .env file");
} else {
  infuraApiKey = process.env.INFURA_API_KEY;
}

function createTestnetConfig(network) {

    const url = "https://" + network + ".infura.io/v3/" + infuraApiKey;

    return {
      accounts: [privateKey],
      chainId: chainIds[network],
      url,
  }
}

const config = {
  defaultNetwork: "hardhat",
  gasReporter: {
    currency: "USD",
    enabled: process.env.REPORT_GAS ? true : false,
    excludeContracts: [],
    src: "./contracts",
  },
  networks: {
    rinkeby: createTestnetConfig("rinkeby"),
    ropsten: createTestnetConfig("ropsten"),
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    // apiKey: "ZUQBXSVXNT8RWQDK7Z5NHV4395U5JJFB5M" // matic
    apiKey: "RQ83XPC9R4JQ9GJFXMIGXFEHZIY1SG1E5V" //mainnet
    // apiKey: "FFBBU5ZQ2KV1183XT3VRBKF68ZR56RWT5B" //bsc
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
  },
  solidity: {
    compilers: [
      {
        version: "0.8.13",
      },
      {
        version: "0.8.12",
      },
      {
        version: "0.8.2",
      },

    ],
  },
};

module.exports = config;