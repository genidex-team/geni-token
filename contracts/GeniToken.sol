// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

// GeniToken contract with UUPS upgradeability using OpenZeppelin v5.2.0
contract GeniToken is Initializable, ERC20Upgradeable, UUPSUpgradeable, OwnableUpgradeable {
    // Define total supply as a constant: 10 billion tokens with 18 decimals
    uint256 constant TOTAL_SUPPLY = 10_000_000_000 * 10**18;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers(); // Prevent direct initialization of the implementation contract
    }

    // Initialize the contract with token details and mint total supply
    function initialize() public initializer {
        __ERC20_init("Geni Token", "GENI"); // Set token name and symbol
        __Ownable_init(msg.sender); // Set the deployer as the owner (v5.2.0 syntax)
        __UUPSUpgradeable_init(); // Initialize UUPS upgradeability

        _mint(msg.sender, TOTAL_SUPPLY); // Mint all tokens to the deployer
    }

    // Required by UUPS: only the owner can authorize upgrades
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}