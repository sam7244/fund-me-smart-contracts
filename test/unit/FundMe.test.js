const { assert, expect } = require("chai");
const { network, deployments, ethers } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

require("hardhat-gas-reporter");

describe("FundMe", function () {
    let fundMe;
    let mockV3Aggregator;
    let deployer;
    const sendValue = ethers.utils.parseEther("1");
    //brfore tsting the contract deploy the contract first
    beforeEach(async () => {
        // const accounts = await ethers.getSigners()
        // deployer = accounts[0]
        deployer = (await getNamedAccounts()).deployer;
        await deployments.fixture(["all"]);
        fundMe = await ethers.getContract("FundMe", deployer);
        mockV3Aggregator = await ethers.getContract(
            "MockV3Aggregator",
            deployer
        );
    });
    //fro the constructor
    describe("constructor", function () {
        it("sets the aggregator addresses correctly", async () => {
            const response = await fundMe.getPriceFeed();
            assert.equal(response, mockV3Aggregator.address);
        });
    });
    //for the fund function
    describe("fund", function () {
        it("Fails if you don't sepnd enough eth", async function () {
            await expect(fundMe.fund()).to.be.revertedWith(
                "You need to spend more ETH!"
            );
        });

        it("update the funded value to the data structure", async function () {
            await fundMe.fund({ value: sendValue });
            const response = await fundMe.getAddressToAmountFunded(deployer);
            assert.equal(response.toString(), sendValue.toString());
        });

        it("Adds funder to array of funders", async function () {
            await fundMe.fund({ value: sendValue });
            const response = await fundMe.getFunder(0);
            assert.equal(response, deployer);
        });
    });

    describe("withdraw", async function () {
        beforeEach(async function () {
            await fundMe.fund({ value: sendValue });
        });

        it("withdraw the eth from the single funder", async function () {
            const startingBalanceContract = await fundMe.provider.getBalance(
                fundMe.address
            );

            const startingBalanceDeployer = await fundMe.provider.getBalance(
                deployer
            );

            const transactionresponse = await fundMe.withdraw();
            const transactionReciept = await transactionresponse.wait();

            const { gasUsed, effectiveGasPrice } = transactionReciept;
            const gasPrice = gasUsed.mul(effectiveGasPrice);

            const endingBalanceContract = await fundMe.provider.getBalance(
                fundMe.address
            );

            const endingBalanceDeployer = await fundMe.provider.getBalance(
                deployer
            );

            assert.equal(endingBalanceContract, 0);
            assert.equal(
                endingBalanceDeployer.add(gasPrice).toString(),
                startingBalanceContract.add(startingBalanceDeployer).toString()
            );
        });

        it("allows to withdraw with the multiple accounts", async function () {
            const accounts = await ethers.getSigners();
            for (let i = 0; i < 6; i++) {
                const fundConnectedContrats = await fundMe.connect(accounts[i]);
                await fundConnectedContrats.fund({ value: sendValue });
            }

            const startingBalanceContract = await fundMe.provider.getBalance(
                fundMe.address
            );

            const startingBalanceDeployer = await fundMe.provider.getBalance(
                deployer
            );

            const transactionresponse = await fundMe.cheaperWithdraw();
            const transactionReciept = await transactionresponse.wait();

            const { gasUsed, effectiveGasPrice } = transactionReciept;
            const gasPrice = gasUsed.mul(effectiveGasPrice);

            const endingBalanceContract = await fundMe.provider.getBalance(
                fundMe.address
            );

            const endingBalanceDeployer = await fundMe.provider.getBalance(
                deployer
            );

            assert.equal(endingBalanceContract, 0);
            assert.equal(
                endingBalanceDeployer.add(gasPrice).toString(),
                startingBalanceContract.add(startingBalanceDeployer).toString()
            );

            await expect(fundMe.getFunder(0)).to.be.reverted;

            for (let i = 0; i < 6; i++) {
                assert.equal(
                    await fundMe.getAddressToAmountFunded(accounts[i].address),
                    0
                );
            }
        });

        it("Only allows the owner to withdraw", async function () {
            const accounts = await ethers.getSigners();
            const fundMeConnectedContract = await fundMe.connect(accounts[1]);
            await expect(fundMeConnectedContract.withdraw()).to.be.reverted;
        });
    });
});
