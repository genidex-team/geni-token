

# GeniToken

GeniToken is an ERC20 token built with OpenZeppelin, utilizing the UUPS (Universal Upgradeable Proxy Standard) for upgradeability. The token has a fixed total supply of 10 billion tokens, with the name "Geni Token" and symbol "GENI". It is designed to mint the entire supply upon deployment and does not allow further minting.

## Features
- **Token Name**: Geni Token
- **Symbol**: GENI
- **Total Supply**: 10,000,000,000 tokens (10 billion with 18 decimals)
- **Upgradeable**: Uses UUPS proxy pattern for future upgrades
- **No Additional Minting**: All tokens are minted to the deployer during initialization
- **Ownership**: Only the owner can authorize upgrades

## Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- A blockchain network (local Hardhat network, testnet, or mainnet) for deployment

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/genidex-team/geni-token.git
   cd geni-token
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Install specific OpenZeppelin version and Hardhat plugins**:
   ```bash
   npm install @openzeppelin/contracts-upgradeable@5.2.0 @openzeppelin/hardhat-upgrades
   npm install --save-dev @nomicfoundation/hardhat-toolbox
   ```

## Project Structure
- `contracts/GeniToken.sol`: The main smart contract for GeniToken
- `scripts/deploy.js`: Script to deploy the token
- `test/GeniToken.test.js`: Test suite for the token
- `hardhat.config.js`: Hardhat configuration file

## Configuration
Edit `hardhat.config.js` to add network configurations if deploying to a testnet or mainnet. Example for Sepolia testnet:

```javascript
module.exports = {
  solidity: "0.8.22",
  networks: {
    sepolia: {
      url: "https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID",
      accounts: ["YOUR_PRIVATE_KEY"]
    }
  }
};
```

## Usage

### 1. Compile the Contract
Compile the smart contract to ensure there are no errors:

```bash
npx hardhat compile
```

### 2. Test the Contract
Run the test suite to verify the token's functionality:

```bash
npx hardhat test
```

Expected output:
- Confirms that the total supply is 10 billion tokens and all are minted to the deployer.

### 3. Deploy the Contract
Deploy the token to a local Hardhat network:

```bash
npx hardhat run scripts/deploy.js
```

To deploy to a specific network (e.g., Sepolia):
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

Example output:
```
Starting deployment of GeniToken with OpenZeppelin v5.2.0...
GeniToken successfully deployed to: 0x...
```

### 4. Upgrading the Contract
To upgrade the contract in the future:
1. Create a new version (e.g., `GeniTokenV2.sol`).
2. Use the `upgrade.js` script with the proxy address from the initial deployment.

## Smart Contract Details
- **GeniToken.sol**: 
  - Inherits from `ERC20Upgradeable`, `UUPSUpgradeable`, and `OwnableUpgradeable`.
  - Mints the total supply of 10 billion tokens to the deployer during initialization.
  - Uses UUPS for upgradeability, with upgrade authorization restricted to the owner.
  - Built with Solidity 0.8.22.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing
Feel free to submit issues or pull requests if you have suggestions or improvements! Visit our repository at [https://github.com/genidex-team/geni-token](https://github.com/genidex-team/geni-token).

## Contact
For questions or support, reach out via [contact@genidex.org](mailto:contact@genidex.org) or open an issue on the GitHub repository.


