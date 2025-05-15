// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

abstract contract Storage {

    // Arbitrum
    address public customGatewayAddress;
    address public routerAddress;
    bool internal shouldRegisterGateway;
}