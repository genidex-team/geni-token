
const { network } = require('hardhat');
const { deploy } = require('geni_helper');
const data = require('geni_data');


const proxyAddress = data.getGeniTokenAddress(network.name);

async function main(){
    const [deployer] = await ethers.getSigners();
    const newImpl = await deploy.prepareUpgrade('GeniToken', proxyAddress);
    // newImpl = '0x4AdDFb8A17cE0b8e1999b858DC1b892431699bc8';
    const safeAddress = '0x6bEB0144955D1fcd4CeF7Be6e6faa2C568208913';
    const rpc = data.rpc.SEP;
    const privateKey = data.config.privateKeys[2];
    // await deploy.upgradeThroughSafe(
    //     proxyAddress,
    //     newImpl,
    //     safeAddress,
    //     rpc,
    //     privateKey
    // );
}

main();