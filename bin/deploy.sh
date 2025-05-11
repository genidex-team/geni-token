#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cd ${SCRIPT_DIR}/..
NETWORK=$1
echo $PWD
echo "";
echo "================= deploy.js ================="
npx hardhat run scripts/deploy.js --network $NETWORK
