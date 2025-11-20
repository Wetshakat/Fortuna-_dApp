// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./libraries/Types.sol";

interface IFortunaCore {
    function joinRound(uint256 roundId) external payable;
    function createNewRound() external returns (uint256 newRoundId);
    function getActiveRound() external view returns (uint256);
    function getRoundInfo(uint256 roundId) external view returns (Types.RoundInfo memory);
    function getEntryFee() external view returns (uint256);
    function getPlatformBalance() external view returns (uint256);
    function setEntryFee(uint256 fee) external;
    function withdrawPlatformFees(address to) external;
    function pause() external;
    function unpause() external;
}
