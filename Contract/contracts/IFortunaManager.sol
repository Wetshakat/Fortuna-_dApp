// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./libraries/Types.sol";

interface IFortunaManager {
    function createRound(
        uint256 roundId,
        uint64 closeTime,
        uint256 entryPrice,
        uint32 maxParticipants
    ) external;

    function registerEntry(uint256 roundId, address player) external;

    function closeRound(uint256 roundId) external;

    function setWinner(uint256 roundId, address winner) external;

    function withdrawProtocolFees(address to) external;

    function getRound(uint256 roundId) external view returns (Types.RoundInfo memory);

    function getParticipants(uint256 roundId)
        external
        view
        returns (address[] memory);

    function hasEntered(uint256 roundId, address player)
        external
        view
        returns (bool);

    function getProtocolFees() external view returns (uint256);

    function roundExists(uint256 roundId) external view returns (bool);

    function totalParticipants(uint256 roundId) external view returns (uint256);
}
