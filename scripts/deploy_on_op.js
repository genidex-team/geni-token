// scripts/deploy_geni_token.js

const { ethers, upgrades, network } = require("hardhat");
const data = require('geni_data');

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Contract factory
  const GeniToken = await ethers.getContractFactory("GeniTokenOptimism");

  // L1 remote token address (Ethereum Mainnet)
  const l1Network = data.getL1Network(network.name);
  const remoteTokenAddress = data.getGeniTokenAddress(l1Network);
//   console.log(l1Network, remoteTokenAddress);
//   return;
  // Optimism Standard Bridge address
  const bridgeAddress = "0x4200000000000000000000000000000000000010";
  // Owner of the proxy (for upgrade permissions)
  const initialOwner = deployer.address;

  console.log("Initializing proxy with:", {
    remoteTokenAddress,
    bridgeAddress,
    initialOwner,
  });

  // Deploy upgradeable proxy
  const token = await upgrades.deployProxy(
    GeniToken,
    [initialOwner, remoteTokenAddress, bridgeAddress],
    { initializer: "initialize", kind: "uups" }
  );
//   await token.deployed();
  await token.waitForDeployment();
  data.setGeniTokenAddress(network.name, token.target);
  console.log("GeniTokenOptimism proxy deployed to:", token.target);
  console.log("Implementation address       : ", await upgrades.erc1967.getImplementationAddress(token.target));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});
