
const { ethers, upgrades, network } = require('hardhat');
const data = require('geni_data');

async function main() {
  const proxyAddress = data.getGeniTokenAddress(network.name);
  const ImplStub = await ethers.getContractFactory('GeniToken');
  await upgrades.forceImport(proxyAddress, ImplStub, { kind: 'uups' });
  console.log('Proxy imported ✅');
}
main();