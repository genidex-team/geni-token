

const { ethers, network } = require("hardhat");
const data = require('geni_data');
const helper = require('../helpers/helper');

const l1NetworkName = data.getL1NetworkName(network.name);
const l1TokenAddress = data.getGeniTokenAddress(l1NetworkName);

const bridgeAddress = "0x4200000000000000000000000000000000000010";
const proxySalt = data.getTokenSalt();


async function main() {

    const [deployer] = await ethers.getSigners();
    const initialOwner = deployer.address;
    console.log(`\nNetwork : ${network.name}`);
    console.log(`Deployer: ${deployer.address}`);

    //Deploy on Optimism
    let initArgs = [initialOwner, l1TokenAddress, bridgeAddress];
    await helper.deploy('GeniTokenOptimism', proxySalt, initArgs, 'uups');


}

main()
    .then(() => process.exit(0))
    .catch((e) => { console.error(e); process.exit(1); });
