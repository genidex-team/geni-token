

const { ethers, network } = require("hardhat");
const { getArbitrumNetwork } = require('@arbitrum/sdk');
const data = require('geni_data');
const helper = require('../helpers/helper');

const l2Network = getArbitrumNetwork(421614);
const l1CustomGateway = l2Network.tokenBridge.parentCustomGateway;
const l1GatewayRouter = l2Network.tokenBridge.parentGatewayRouter;
const proxySalt = data.getTokenSalt();

async function main() {

    const [deployer] = await ethers.getSigners();
    const initialOwner = deployer.address;
    console.log(`\nNetwork : ${network.name}`);
    console.log(`Deployer: ${deployer.address}`);

    let initArgs = [initialOwner, l1CustomGateway, l1GatewayRouter];
    await helper.deploy('GeniToken', proxySalt, initArgs, 'uups');

}

main()
    .then(() => process.exit(0))
    .catch((e) => { console.error(e); process.exit(1); });
