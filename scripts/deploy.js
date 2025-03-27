const { ethers, upgrades } = require("hardhat");
const hre = require("hardhat");

const data = require('../../geni_data/index');

async function main() {
    const GeniToken = await ethers.getContractFactory("GeniToken");
    const token = await upgrades.deployProxy(
        GeniToken,
        [],
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