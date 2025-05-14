
const {ethers, upgrades, network, run} = require("hardhat");
const data = require('geni_data');

async function main() {
  const [deployer] = await ethers.getSigners();
  const initialOwner = deployer.address;
  const recipient = deployer.address;
  const contractAddress = data.getGeniTokenAddress(network.name);
  const constructorArgs = [
    recipient,
    initialOwner
  ];

  try {
    await run("verify:verify", {
      address: contractAddress,
      // constructorArguments: constructorArgs,
    });

    console.log("✅ Verification successful!");
  } catch (err) {
    console.error("❌ Verification failed:");
    console.error(err.message || err);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Script error:", error);
    process.exit(1);
  });
