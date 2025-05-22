
const { network } = require('hardhat');
const {deploy} = require('geni_helper');
const data = require('geni_data');


const proxyAddress = data.getGeniTokenAddress(network.name);

async function main(){
    const safeAddress = '0x6bEB0144955D1fcd4CeF7Be6e6faa2C568208913';
    const [deployer] = await ethers.getSigners();
    const currentOwner = await deploy.getOwnerUUPS(proxyAddress);
    console.log({
        deployer: deployer.address,
        currentOwner,
        newOwner: safeAddress
    })
    const contract = await ethers.getContractAt('GeniToken', proxyAddress);
    
    await deploy.transferOwnershipUUPS(contract, safeAddress);

    await deploy.getOwnerUUPS(proxyAddress);

}

main();