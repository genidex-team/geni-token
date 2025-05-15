// scripts/deploy_geni_token.js

const { ethers, upgrades, network } = require("hardhat");
const data = require('geni_data');

const { getArbitrumNetwork } = require('@arbitrum/sdk');
const { JsonRpcProvider, Wallet } = require('ethers');

const walletPrivateKey = data.config.privateKeys[0];
const l1Provider = new JsonRpcProvider(data.rpc.SEP);
const l2Provider = new JsonRpcProvider(data.rpc.ARB_SEP);
const l1Wallet = new Wallet(walletPrivateKey, l1Provider);

// const l2CustomGatewayAddress = '0x8Ca1e1AC0f260BC4dA7Dd60aCA6CA66208E642C5';

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const l2Network = await getArbitrumNetwork(421614);
  const l2CustomGatewayAddress = l2Network.tokenBridge.childCustomGateway;
  console.log('l2CustomGatewayAddress', l2CustomGatewayAddress);
  // return;

  // Contract factory
  const GeniToken = await ethers.getContractFactory("GeniTokenArbitrum");

  // L1 remote token address (Ethereum Mainnet)
  const l1NetworkName = data.getL1NetworkName(network.name);
  const l1TokenAddress = data.getGeniTokenAddress(l1NetworkName);
  console.log(l1NetworkName, l1TokenAddress);

  const initialOwner = deployer.address;

  console.log("Initializing proxy with:", {initialOwner, l1TokenAddress, l2CustomGatewayAddress});

  // Deploy upgradeable proxy
  const token = await upgrades.deployProxy(
    GeniToken,
    [initialOwner, l1TokenAddress, l2CustomGatewayAddress],
    { initializer: "initialize", kind: "uups" }
  );
//   await token.deployed();
  await token.waitForDeployment();
  data.setGeniTokenAddress(network.name, token.target);
  console.log("GeniTokenArbitrum proxy deployed to:", token.target);
  console.log("Implementation address       : ", await upgrades.erc1967.getImplementationAddress(token.target));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});
