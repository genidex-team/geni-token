#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cd ${SCRIPT_DIR}/..
NETWORK=$1
echo $PWD

echo "";
echo "================= deploy.factory.js ================="
npx hardhat run scripts/deploy.factory.js --network $NETWORK

echo "";
echo "================= deploy.placeholder.js ================="
npx hardhat run scripts/deploy.placeholder.js --network $NETWORK

echo "";
echo "================= deploy.js ================="
npx hardhat run scripts/deploy.ether.js --network $NETWORK
