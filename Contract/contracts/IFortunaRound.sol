// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./libraries/Types.sol";

interface IFortunaRound {
    function addPlayer(address player) external;
    function closeRound() external;
    function isRoundFull() external view returns (bool);
    function isExpired() external view returns (bool);
    function distributePrize() external;
    function getRoundInfo() external view returns (Types.RoundInfo memory);
    function getParticipants() external view returns (address[] memory);
    function timeRemaining() external view returns (uint256);
    function getRoundId() external view returns (uint256);
    function getPrizePool() external view returns (uint256);
}
