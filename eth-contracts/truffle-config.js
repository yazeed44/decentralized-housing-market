const HDWalletProvider = require("@truffle/hdwallet-provider");
const mnemonic = "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat";
require("dotenv").config();

module.exports = {
    networks: {
        development: {
            provider: function () {
                return new HDWalletProvider(mnemonic, "http://127.0.0.1:7545/", 0, 50);
            },
            network_id: "*",
            websockets: true,
        },

        rinkeby: {
            provider: () => new HDWalletProvider(process.env.PRIVATE_KEY, `https://rinkeby.infura.io/v3/${process.env.INFURA_KEY}`),
            network_id: 4, // rinkeby's id
            gas: 4500000, // rinkeby has a lower block limit than mainnet
            gasPrice: 10000000000,
        },
    },

    compilers: {
        solc: {
            version: "^0.8.14",
        },
    },
    plugins: ["truffle-plugin-verify"],
    api_keys: {
        etherscan: process.env.ETHERSCAN_API_KEY,
    },
};
