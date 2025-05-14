const { ethers, upgrades } = require("hardhat");
const hre = require("hardhat");
const { getArbitrumNetwork } = require('@arbitrum/sdk');

const data = require('geni_data');

async function main() {

    const l1CustomGateway = '0xba2F7B6eAe1F9d174199C5E4867b563E0eaC40F3';
    const l1GatewayRouter = '0xcE18836b233C83325Cc8848CA4487e94C6288264';

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