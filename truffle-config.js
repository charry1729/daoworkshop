const path = require("path");
const compilerPath = path.join(__dirname, "soljson-v0.8.5-nightly.2021.5.10+commit.643140e2.js");
module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      networkCheckTimeout: 999999,   
      port: 8545,
      network_id: "*",
      gas: 5000000
    },
    loc_development_development: {
      network_id: "*",
      port: 8545,
      host: "127.0.0.1"
    }
  },
  contracts_directory: './contracts',
  contracts_build_directory: './abis',
  compilers: {
    solc: {
      version: compilerPath,
      settings: {
        optimizer: {
          enabled: true,
          runs: 2000
        }
      }
    }
  }
};
