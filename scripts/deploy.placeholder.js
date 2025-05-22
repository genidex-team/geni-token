

const { ethers, network } = require("hardhat");
const data = require('geni_data');
const {factory} = require('geni_helper');


async function main() {
    const [deployer] = await ethers.getSigners();
    const initialOwner = deployer.address;
    console.log(`\nNetwork : ${network.name}`);
    console.log(`Deployer: ${deployer.address}`);

    // IMPLEMENTATION
    const Token = await ethers.getContractFactory("PlaceholderUUPS");
    let implSalt = ethers.keccak256(ethers.toUtf8Bytes("Placeholder.UUPS"));
    const implPredicted = await factory.deployFromFactory(Token.bytecode, implSalt);
    data.setPlaceholderUUPS(network.name, implPredicted);
}

main()
    .then(() => process.exit(0))
    .catch((e) => { console.error(e); process.exit(1); });
