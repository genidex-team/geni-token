// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "./Base.sol";
import "./IGeniToken.sol";
import "./bridge/ArbitrumBridge.sol";

contract GeniToken is Base, ArbitrumBridge {
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        address initialOwner,
        address _arbCustomGateway,
        address _arbGatewayRouter
    ) public initializer {
        __ERC20_init("GeniDex", "GENI");
        __ERC20Burnable_init();
        __ERC20Permit_init("GeniDex");
        __ERC20Votes_init();
        __Ownable_init(initialOwner);
        __UUPSUpgradeable_init();
        __ArbitrumBridgeInit(_arbCustomGateway, _arbGatewayRouter);

        _mint(initialOwner, 10_000_000_000 * 10 ** decimals());
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {}

    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override returns (bool) {
        return
            interfaceId == type(IGeniToken).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) public override(ICustomToken, ERC20Upgradeable) returns (bool) {
        return super.transferFrom(sender, recipient, amount);
    }

    function balanceOf(address account) public view override(
        ICustomToken,
        ERC20Upgradeable
    ) returns (uint256) {
        return super.balanceOf(account);
    }
}
