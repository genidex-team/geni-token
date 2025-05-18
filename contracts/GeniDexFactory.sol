// SPDX-License-Identifier: MIT

pragma solidity ^0.8.27;

error InvalidAddress(address provided, address expected);

contract GeniDexFactory {
    function deploy(bytes memory bytecode, bytes32 salt, address predictedAddr) external {
        address addr;
        assembly {
            addr := create2(0, add(bytecode, 0x20), mload(bytecode), salt)
            if iszero(extcodesize(addr)) {
                revert(0, 0)
            }
        }
        if(addr != predictedAddr){
            revert InvalidAddress(addr, predictedAddr);
        }
    }
}