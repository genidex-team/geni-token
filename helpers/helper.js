
const { ethers, upgrades, network } = require("hardhat");
const { AbiCoder, solidityPacked } = require('ethers');
const data = require('geni_data');

const abiCoder = new AbiCoder();
// const IMPLEMENTATION_SLOT = "0x360894A13BA1A3210667C828492DB98DCA3E2076CC3735A920A3CA505D382BBC";

class Helper{
    async getImplAddress(proxyAddress){
        return await upgrades.erc1967.getImplementationAddress(proxyAddress);
    }

    logTile(title){
        console.log('\n--------------------------------------');
        console.log(title);
        console.log('--------------------------------------\n');
    }

    async getInitCode(contractName){
        const contract = await ethers.getContractFactory(contractName);
        return contract.bytecode;
    }

    async buildProxyInitCode(implAddr, initCall) {
        const proxy = await ethers.getContractFactory("ERC1967Proxy");
        return solidityPacked(
            ["bytes", "bytes"],
            [
                proxy.bytecode,
                abiCoder.encode(["address", "bytes"], [implAddr, initCall])
            ]
        );
    }

    async getProxyInitCode(){
        const PLACEHOLDER_UUPS = data.getPlaceholderUUPS(network.name);
        const proxyInitCode = await this.buildProxyInitCode(
            PLACEHOLDER_UUPS,
            '0x'
        );
        return proxyInitCode;
    }

    async getProxyInitCodeHash(){
        return ethers.keccak256(await this.getProxyInitCode());
    }

    async deployFromFactory(initCode, saltHex) {
        const FACTORY = data.getFactoryAddress(network.name);
        console.log({FACTORY});
        const implInitHash = ethers.keccak256(initCode);
        const predictedAddress = ethers.getCreate2Address(FACTORY, saltHex, implInitHash);

        if ((await ethers.provider.getCode(predictedAddress)).length === 2) {
            console.log("Deploying…");
            const factory = await ethers.getContractAt("GeniDexFactory", FACTORY);
            const tx = await factory.deploy(initCode, saltHex, predictedAddress);
            console.log(`deployFromFactory tx ${tx.hash}`);
            console.log('predictedAddress:', predictedAddress)
            await tx.wait();
        }else{
            const message = `
            Address already exists on-chain: ${predictedAddress}
            Please upgrade the contract or change the salt to generate a new address.
            `;
            throw new Error(message);
        }
        return predictedAddress;
    }

    async deployProxyWithPlaceholderUUPS(SALT_PROXY){
        const proxyInitCode = await this.getProxyInitCode();
        const proxyPredicted = await this.deployFromFactory(proxyInitCode, SALT_PROXY);
        return proxyPredicted;
    }

    async upgradeToAndCall(proxyAddress, contractName, newImplAddress, initArgs){
        const Contract = await ethers.getContractFactory(contractName);
        const storedImpl = await this.getImplAddress(proxyAddress);
        // console.log(storedImpl);
        if(storedImpl.toLowerCase() == newImplAddress.toLocaleLowerCase()){
            console.log("Implementation is already up to date, skipping");
            console.log(`Current Implementation: ${storedImpl}`)
        }else{
            console.log(`Current Implementation:  ${storedImpl}`);
            console.log(`New Implementation:      ${newImplAddress}`)
            let initCalldata = '0x';
            if(initArgs && initArgs.length>0){
                initCalldata = Contract.interface.encodeFunctionData("initialize", initArgs);
            }
            const contract = Contract.attach(proxyAddress);
            const tx = await contract.upgradeToAndCall(newImplAddress, initCalldata);
            await tx.wait();
        }
    }

    async deploy(contractName, proxySalt, initArgs, kind){

        // PROXY
        this.logTile('DEPLOY PROXY')
        const proxyAddress = await this.deployProxyWithPlaceholderUUPS(proxySalt);

        // IMPLEMENTATION
        this.logTile('DEPLOY IMPLEMENTATION')
        const Contract = await ethers.getContractFactory(contractName);
        const contract = await Contract.deploy();
        await contract.waitForDeployment();
        console.log("✅ Contract deployed to:", contract.target);
        const implPredicted = contract.target;

        // upgradeToAndCall
        this.logTile('PROXY.upgradeToAndCall')
        await this.upgradeToAndCall(proxyAddress, contractName, implPredicted, initArgs);
        await upgrades.forceImport(proxyAddress, Contract, { kind: kind });
        data.setGeniTokenAddress(network.name, proxyAddress)
        return proxyAddress;
    }

}

module.exports = new Helper();