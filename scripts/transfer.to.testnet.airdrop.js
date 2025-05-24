const { ethers, network } = require("hardhat");
const data = require('geni_data');

async function main() {
  const [deployer] = await ethers.getSigners();
  const tokenAddress = data.getGeniTokenAddress(network.name);

  const recipient = data.testnetAirdrop.getAddress(network.name);
  const amount = ethers.parseUnits("200000000", 18);

  const token = await ethers.getContractAt("IERC20", tokenAddress, deployer);

  const tx = await token.transfer(recipient, amount);
  console.log(`Sent ${amount} tokens to ${recipient}`);
  console.log("Tx hash:", tx.hash);

  await tx.wait();
  console.log("✅ Transfer confirmed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});