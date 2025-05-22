

const { ethers, network } = require("hardhat");
const { getArbitrumNetwork } = require('@arbitrum/sdk');
const data = require('geni_data');
const {factory} = require('geni_helper');

// console.log({proxySalt})
// console.log(l2Network)

let proxySalt, l2Network, l1CustomGateway, l1GatewayRouter, arbitrumChainId;

if(data.isTestnet(network.name)){
    arbitrumChainId = data.getChainId('arb_sepolia');
}else if(data.isMainnet(network.name)){
    arbitrumChainId = data.getChainId('arbitrum')
}
if(data.isDevnet(network.name)){
    // proxySalt = data.getTokenSalt();
    proxySalt = data.randomBytes32();
    l1CustomGateway = ethers.ZeroAddress;
    l1GatewayRouter = ethers.ZeroAddress;
}else{
    proxySalt = data.getTokenSalt();
    l2Network = getArbitrumNetwork(arbitrumChainId);
    l1CustomGateway = l2Network.tokenBridge.parentCustomGateway;
    l1GatewayRouter = l2Network.tokenBridge.parentGatewayRouter;
}

async function main() {

    const [deployer] = await ethers.getSigners();
    const initialOwner = deployer.address;
    console.log(`\nNetwork : ${network.name}`);
    console.log(`Deployer: ${deployer.address}`);
    console.log({initialOwner, l1CustomGateway, l1GatewayRouter})
    let initArgs = [initialOwner, l1CustomGateway, l1GatewayRouter];
    await factory.deploy('GeniToken', proxySalt, initArgs, 'uups');

}

main()
    .then(() => process.exit(0))
    .catch((e) => { console.error(e); process.exit(1); });
