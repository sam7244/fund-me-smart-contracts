const networkConfig = {
    5: {
        name: "goerli",
        ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
    },
};

const developmentChains = ["hardhat", "localhost"];
const DECIMALS = 8;
const INITIAL_ANSWER = 200000000;

//using this way we can direclty access the file in other file  like
//const {networkConfig} = require("../helper-hardhat-config");

//otherwise they have to import like
//const network = require("../helper-hardhat-config");
//const networkConfig = network.netwokConfig;
module.exports = {
    networkConfig,
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER,
};
