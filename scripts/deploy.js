const { ethers, upgrades } = require("hardhat");
const hre = require("hardhat");
const { getArbitrumNetwork } = require('@arbitrum/sdk');
const { JsonRpcProvider, Wallet } = require('ethers');

const data = require('geni_data');

// const walletPrivateKey = data.config.privateKeys[0];
// const l1Provider = new JsonRpcProvider(data.rpc.SEP);
// const l2Provider = new JsonRpcProvider(data.rpc.ARB_SEP);
// const l1Wallet = new Wallet(walletPrivateKey, l1Provider);

async function main() {

    // const blockNumber = await l2Provider.getBlockNumber();
    // console.log('Current block number:', blockNumber);
    // console.log(l2Provider)
    const l2Network = getArbitrumNetwork(421614);
    console.log(l2Network);
    return;

    // const l1CustomGateway = '0xba2F7B6eAe1F9d174199C5E4867b563E0eaC40F3';
    // const l1GatewayRouter = '0xcE18836b233C83325Cc8848CA4487e94C6288264';

    const l1CustomGateway = l2Network.tokenBridge.parentCustomGateway;
    const l1GatewayRouter = l2Network.tokenBridge.parentGatewayRouter;
    console.log(l1GatewayRouter, l1GatewayRouter);

    // return;

    const [deployer] = await ethers.getSigners();
    const initialOwner = deployer.address;
    const recipient = deployer.address;
    const GeniToken = await ethers.getContractFactory("GeniToken");
    const token = await upgrades.deployProxy(
        GeniToken,
        [recipient, initialOwner, l1CustomGateway, l1GatewayRouter],
        { initializer: "initialize", kind: "uups" }
    );
    await token.waitForDeployment();
    //   await token.deployed();
    const network = hre.network.name;
    data.setGeniTokenAddress(network, token.target);
    // data.setGeniDexAddress(network);
    console.log("\n✅ GeniToken deployed to     : ", token.target);
    console.log("Implementation address       : ", await upgrades.erc1967.getImplementationAddress(token.target));
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});