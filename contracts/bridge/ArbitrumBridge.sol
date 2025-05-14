// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import '../Base.sol';

interface IL1CustomGateway {
    function registerTokenToL2(
        address _l2Address,
        uint256 _maxGas,
        uint256 _gasPriceBid,
        uint256 _maxSubmissionCost,
        address _creditBackAddress
    ) external payable returns (uint256);
}

interface IL1GatewayRouter {
    function setGateway(
        address _newGateway,
        uint256 _maxGas,
        uint256 _gasPriceBid,
        uint256 _maxSubmissionCost,
        address _creditBackAddress
    ) external payable returns (uint256);
}

interface ICustomToken {
    function isArbitrumEnabled() external view returns (uint8);

    function registerTokenOnL2(
        address l2TokenAddress,
        uint256 maxSubmissionCostForCustomGateway,
        uint256 maxSubmissionCostForRouter,
        uint256 maxGasForCustomGateway,
        uint256 maxGasForRouter,
        uint256 gasPriceBid,
        address creditBackAddress
    ) external payable;
}

abstract contract ArbitrumBridge is Base, ICustomToken {

    function __ArbitrumBridgeInit(
        address _customGateway,
        address _gatewayRouter
    ) internal onlyInitializing {
        arbCustomGateway = _customGateway;
        arbGatewayRouter = _gatewayRouter;
        arbShouldRegisterGateway = false;
    }

    function isArbitrumEnabled() external view override returns (uint8) {
        require(arbShouldRegisterGateway, "NOT_EXPECTED_CALL");
        return 0xb1;
    }

    function registerTokenOnL2(
        address l2TokenAddress,
        uint256 maxSubmissionCostForCustomGateway,
        uint256 maxSubmissionCostForRouter,
        uint256 maxGasForCustomGateway,
        uint256 maxGasForRouter,
        uint256 gasPriceBid,
        address creditBackAddress
    ) external override onlyOwner payable {
        require(msg.value >= maxSubmissionCostForCustomGateway + maxSubmissionCostForRouter, "Insufficient fee");

        bool prev = arbShouldRegisterGateway;
        arbShouldRegisterGateway = true;

        IL1CustomGateway(arbCustomGateway).registerTokenToL2{ value: maxSubmissionCostForCustomGateway }(
            l2TokenAddress,
            maxGasForCustomGateway,
            gasPriceBid,
            maxSubmissionCostForCustomGateway,
            creditBackAddress
        );

        IL1GatewayRouter(arbGatewayRouter).setGateway{ value: maxSubmissionCostForRouter }(
            arbCustomGateway,
            maxGasForRouter,
            gasPriceBid,
            maxSubmissionCostForRouter,
            creditBackAddress
        );
        arbShouldRegisterGateway = prev;
    }
}
