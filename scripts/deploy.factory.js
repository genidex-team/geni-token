const { ethers, network } = require("hardhat");
const data = require('geni_data');

async function main () {
  
  var deployer;
  var targetNonce = 0;
  if(network.name=='geni' || network.name=='localhost'){
    [deployer] = await ethers.getSigners();
    var currentNonce = await hre.network.provider.send("eth_getTransactionCount", [
      deployer.address, "latest",
    ]);
    targetNonce = currentNonce;
  }else{
    deployer = new ethers.Wallet(data.getFactoryPrivateKey(), ethers.provider);
    var currentNonce = await hre.network.provider.send("eth_getTransactionCount", [
      deployer.address, "latest",
    ]);
    console.log({
      deployer: deployer.address,
      currentNonce: BigInt(currentNonce),
      targetNonce
    })

    if (BigInt(current) !== BigInt(targetNonce)){
      throw new Error(`Nonce mismatch: wanted ${targetNonce}, got ${BigInt(current)}`);
    }
  }

  // 1. Predict address (optional sanity-check)
  const predicted = ethers.getCreateAddress({ from: deployer.address, nonce: targetNonce });
  console.log(`Predicted address: ${predicted}`);

  // 2. Deploy contract with explicit nonce override
  const Factory = await ethers.getContractFactory("GeniDexFactory");
  const deployTx = await Factory.getDeployTransaction();
  // console.log(deployTx);
  const sent = await deployer.sendTransaction({ ...deployTx, nonce: targetNonce });
  console.log("Tx hash:", sent.hash);

  const receipt = await sent.wait();
  console.log(`GeniDexFactory deployed at ${receipt.contractAddress}`);

  data.setFactoryAddress(network.name, receipt.contractAddress);

}

main()
  .then(() => process.exit(0))
  .catch(e => { console.error(e); process.exit(1); });
