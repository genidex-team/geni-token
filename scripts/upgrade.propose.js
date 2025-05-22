
const { network, upgrades } = require('hardhat');
const {deploy, safe} = require('geni_helper');
const data = require('geni_data');
const { Wallet } = require('ethers');


const proxyAddress = data.getGeniTokenAddress(network.name);

async function main(){
    const [deployer] = await ethers.getSigners();
    const privateKey = data.getProposerPrivateKey();
    const wallet = new Wallet(privateKey)
    const ownerAddress = wallet.address;
    const tokenName = data.getTokenName(network.name);
    const newImplAddress = await deploy.prepareUpgrade(tokenName, proxyAddress);
    const safeAddress = data.getSafeAddress();
    const chainId = (data.getChainId(network.name));
    const rpc = data.getRPC(network.name);
    

    const proxyAbi = ["function upgradeToAndCall(address newImplementation, bytes data)"];
    const iface = new ethers.Interface(proxyAbi);
    const callData = iface.encodeFunctionData("upgradeToAndCall", [newImplAddress, '0x']);

    const safeTransactionData = {
        to: proxyAddress,
        value: '0',
        data: callData
    }

    safe.proposeTransaction({
        ownerAddress,
        safeAddress,
        safeTransactionData,
        chainId,
        rpc,
        privateKey
    })

}

main();