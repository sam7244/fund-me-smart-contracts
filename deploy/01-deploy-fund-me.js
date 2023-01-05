//

const { network } = require("hardhat");
const {
    networkConfig,
    developmentChains,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");
require("dotenv").config();

//same ss defining the function () {} and callin in the module.export here we are using the anonymous function
//same as the hre parameter we are just return directly as other wise it will be hre.getNamedAccounts hre.deployments
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;

    let ethUsdPriceFeedAddress;
    if (chainId == 31337) {
        //due to the all the files in the deploy get executed if the network is local the mock will be executed
        //then we can get the address of the mock contract by using the get function
        //it will give the recent contract deployed
        const ethUsdAggregator = await deployments.get("MockV3Aggregator");
        ethUsdPriceFeedAddress = ethUsdAggregator.address;
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
    }

    //replacing the classic deployment by deploy / getcontaractFactory method
    const fundMe = await deploy("FundMe", {
        //from who
        from: deployer,
        args: [ethUsdPriceFeedAddress],
        //custom log we don't have to use the console.log and all
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    });
    log("--------------------------------------");

    if (
        !developmentChains.includes(network.name) &&
        process.env.ENTHERSCAN_API_KEY
    ) {
        await verify(fundMe.address, [ethUsdPriceFeedAddress]);
    }
};
//used to call just the this deployment script by using the tags
//yarn hardhat deploy --tags fundme
module.exports.tags = ["all", "fundme"];
