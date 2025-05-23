

const { ethers, network } = require("hardhat");
const { getArbitrumNetwork } = require('@arbitrum/sdk');
const data = require('geni_data');
const {factory} = require('geni_helper');

const l1NetworkName = data.getL1NetworkName(network.name);
const l1TokenAddress = data.getGeniTokenAddress(l1NetworkName);

// const l2Network = getArbitrumNetwork(421614);
// const l2CustomGatewayAddress = l2Network.tokenBridge.childCustomGateway;
// const proxySalt = data.getTokenSalt();

let proxySalt, arbitrumChainId, l2Network, l2CustomGatewayAddress;
if(data.isTestnet(network.name)){
    arbitrumChainId = data.getChainId('arb_sepolia');
}else if(data.isMainnet(network.name)){
    arbitrumChainId = data.getChainId('arbitrum')
}
if(data.isDevnet(network.name)){
    // proxySalt = data.getTokenSalt();
    proxySalt = data.randomBytes32();
    l2CustomGatewayAddress = ethers.ZeroAddress;
}else{
    proxySalt = data.getTokenSalt();
    l2Network = getArbitrumNetwork(arbitrumChainId);
    l2CustomGatewayAddress = l2Network.tokenBridge.childCustomGateway;
}


console.log({
    l1NetworkName,
    l1TokenAddress,
    l2CustomGatewayAddress,
    proxySalt
})
if(!l1TokenAddress){
    const message = `
    L1 token address not found.
    Please deploy the token on the L1 network before proceeding.
    `;
    throw new Error(message);
}

async function main() {

    const [deployer] = await ethers.getSigners();
    const initialOwner = deployer.address;
    console.log(`\nNetwork : ${network.name}`);
    console.log(`Deployer: ${deployer.address}`);

    // Deploy on Arbitrum
    let initArgs = [initialOwner, l1TokenAddress, l2CustomGatewayAddress];
    const proxyAddress = await factory.deploy('GeniTokenArbitrum', proxySalt, initArgs, 'uups');
    data.setGeniTokenAddress(network.name, proxyAddress)

}

main()
    .then(() => process.exit(0))
    .catch((e) => { console.error(e); process.exit(1); });
