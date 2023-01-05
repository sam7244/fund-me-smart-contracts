require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */
const GOERLI_URL =
    process.env.goerli_url ||
    "https://eth-goerli.g.alchemy.com/v2/NQ6EMU3y1PsZ5eBdLG93eyaQQTYz7bTS";
const PRIVATE_KEY =
    process.env.private_key ||
    "9699f985adb4cbec9486f61a502b2ad158fb2b0db6de3c270b18aceac8557676";
const ETHERSCAN_API_KEY =
    process.env.ENTHERSCAN_API_KEY || "TTKG29U2G5KWFNRQS44NGK9DSX1Z1IZV2P";
const COIN_MARKET_CAP =
    process.env.COIN_MARKET_CAP || "4cda31b2-8146-44bd-abed-b39bcbf4d9ee";

module.exports = {
    solidity: {
        compilers: [{ version: "0.8.17" }, { version: "0.6.6" }],
    },
    defaultNetwork: "hardhat",
    networks: {
        goerli: {
            url: GOERLI_URL,
            accounts: [PRIVATE_KEY],
            chainId: 5,
            blockConfirmations: 6,
        },
    },
    namedAccounts: {
        deployer: 0,
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },
    gasReporter: {
        enabled: true,
        currency: "USD",
        outputFile: "gas-report.txt",
        noColors: true,
        coinmarketcap: COIN_MARKET_CAP,
    },
};
