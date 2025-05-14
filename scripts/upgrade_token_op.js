const { ethers, upgrades } = require("hardhat");
const hre = require("hardhat");
const data = require("geni_data");

async function main() {
    const [deployer] = await ethers.getSigners();
    const network = hre.network.name;

    const proxyAddress = data.getGeniTokenAddress(network);
    if (!proxyAddress) {
        throw new Error(`GeniToken address not found for network: ${network}`);
    }

    console.log("Upgrading GeniToken at:", proxyAddress);

    const GeniToken = await ethers.getContractFactory("GeniTokenOptimism");
    const upgraded = await upgrades.upgradeProxy(proxyAddress, GeniToken, {
        kind: "uups",
    });

    console.log("\n✅ GeniToken successfully upgraded.\n");
    console.log("Proxy address:             ", upgraded.target);
    console.log("New implementation address:", await upgrades.erc1967.getImplementationAddress(proxyAddress));
}

main().catch((error) => {
    console.error("Upgrade failed:", error);
    process.exitCode = 1;
});