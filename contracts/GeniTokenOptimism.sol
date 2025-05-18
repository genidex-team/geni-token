// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {ERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import {ERC20PermitUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PermitUpgradeable.sol";
import {ERC20VotesUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {NoncesUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/NoncesUpgradeable.sol";
import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
/**
 * @title ILegacyMintableERC20
 * @notice Legacy interface for the StandardL2ERC20 contract.
 */
interface ILegacyMintableERC20 {
    function mint(address _to, uint256 _amount) external;
    function burn(address _from, uint256 _amount) external;
    function l1Token() external view returns (address);
    function l2Bridge() external view returns (address);
}

/// @title GeniTokenOptimism
/// @notice Upgradeable ERC20 token on Optimism with governance (voting) support and Standard Bridge functionality.
interface IOptimismMintableERC20 {
    function remoteToken() external view returns (address);
    function bridge() external view returns (address);
    function mint(address to, uint256 amount) external;
    function burn(address from, uint256 amount) external;
}

contract GeniTokenOptimism is
    Initializable,
    ERC20Upgradeable,
    ERC20PermitUpgradeable,
    ERC20VotesUpgradeable,
    OwnableUpgradeable,
    UUPSUpgradeable,
    IOptimismMintableERC20,
    ILegacyMintableERC20,
    IERC165
{
    /// @notice Address of the corresponding L1 token.
    address private _remoteTokenAddress;

    /// @notice Address of the L2 Standard Bridge.
    address private _bridgeAddress;

    /// @notice Emitted whenever tokens are minted for an account.
    /// @param account Address of the account tokens are being minted for.
    /// @param amount  Amount of tokens minted.
    event Mint(address indexed account, uint256 amount);
 
    /// @notice Emitted whenever tokens are burned from an account.
    /// @param account Address of the account tokens are being burned from.
    /// @param amount  Amount of tokens burned.
    event Burn(address indexed account, uint256 amount);
 
    /// @notice A modifier that only allows the bridge to call
    modifier onlyBridge() {
        require(msg.sender == _bridgeAddress, "GeniTokenOptimism: only bridge can mint and burn");
        _;
    }

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /// @notice Initializes the token with name, symbol, remoteToken, bridge, and sets the owner.
    /// @param remoteTokenAddress_ Address of the L1 GeniToken on Ethereum Mainnet.
    /// @param bridgeAddress_ Address of the L2 Standard Bridge on Optimism (0x4200000000000000000000000000000000000010).
    /// @param initialOwner Address to set as owner and admin for upgrade.
    function initialize(
        address initialOwner,
        address remoteTokenAddress_,
        address bridgeAddress_
    ) public initializer {
        __ERC20_init("GeniDex", "GENI");
        __ERC20Permit_init("GeniDex");
        __ERC20Votes_init();
        __Ownable_init(initialOwner);
        __UUPSUpgradeable_init();

        _remoteTokenAddress = remoteTokenAddress_;
        _bridgeAddress = bridgeAddress_;
    }

    /// @notice Mints tokens when bridging from L1. Only bridge can call.
    function mint(address to, uint256 amount)
        external override(IOptimismMintableERC20, ILegacyMintableERC20) onlyBridge {
        _mint(to, amount);
        emit Mint(to, amount);
    }

    /// @notice Burns tokens when withdrawing to L1. Only bridge can call.
    function burn(address from, uint256 amount)
        external override(IOptimismMintableERC20, ILegacyMintableERC20) onlyBridge {
        _burn(from, amount);
        emit Burn(from, amount);
    }

    /// @notice ERC165 interface check function.
    /// @param _interfaceId Interface ID to check.
    /// @return Whether or not the interface is supported by this contract.
    function supportsInterface(bytes4 _interfaceId) external pure override(IERC165) returns (bool) {
        bytes4 iface1 = type(IERC165).interfaceId;
        // Interface corresponding to the legacy L2StandardERC20
        bytes4 iface2 = type(ILegacyMintableERC20).interfaceId;
        // Interface corresponding to the updated OptimismMintableERC20
        bytes4 iface3 = type(IOptimismMintableERC20).interfaceId;
        return _interfaceId == iface1 || _interfaceId == iface2 || _interfaceId == iface3;
    }

    /// @notice Legacy getter for the remote token. Use REMOTE_TOKEN going forward.
    function l1Token() public view override returns (address) {
        return _remoteTokenAddress;
    }
 
    /// @notice Legacy getter for the bridge. Use BRIDGE going forward.
    function l2Bridge() public view override returns (address) {
        return _bridgeAddress;
    }

    /// @notice Returns the L1 token address.
    function remoteToken() external view override returns (address) {
        return _remoteTokenAddress;
    }

    /// @notice Returns the L2 bridge address.
    function bridge() external view override returns (address) {
        return _bridgeAddress;
    }

    /// @dev Authorizes upgrades to the implementation. Only owner.
    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {}

    /*function _mint(
        address to,
        uint256 amount
    ) internal override(ERC20Upgradeable) {
        super._mint(to, amount);
    }

    function _burn(
        address from,
        uint256 amount
    ) internal override(ERC20Upgradeable) {
        super._burn(from, amount);
    }*/

    // The following functions are overrides required by Solidity.

    function _update(
        address from,
        address to,
        uint256 value
    ) internal override(ERC20Upgradeable, ERC20VotesUpgradeable) {
        super._update(from, to, value);
    }

    function nonces(
        address owner
    )
        public
        view
        override(ERC20PermitUpgradeable, NoncesUpgradeable)
        returns (uint256)
    {
        return super.nonces(owner);
    }
}
