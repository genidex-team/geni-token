
const helper = require('../helpers/helper');
const data = require('geni_data');

async function main() {
    const proxyInitCodeHash = await helper.getProxyInitCodeHash();
    const factory = data.getFactoryAddress(network.name);
    console.log({proxyInitCodeHash, factory});
}

main()
    .then(() => process.exit(0))
    .catch((e) => { console.error(e); process.exit(1); });