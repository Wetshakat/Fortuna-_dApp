// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library Events {
    event PlayerJoined(uint256 indexed roundId, address indexed player, uint256 entryFee);
    event RoundFull(uint256 indexed roundId);
    event RoundTimerStarted(uint256 indexed roundId, uint256 startTimestamp, uint256 endTimestamp);
    event RoundClosed(uint256 indexed roundId, uint256 totalPlayers, uint256 prizePool);
    event NewRoundCreated(uint256 indexed roundId, uint256 timestamp);
    event RandomnessRequested(uint256 indexed roundId, bytes32 indexed requestId);
    event RandomnessFulfilled(uint256 indexed roundId, uint256 randomness);
    event WinnerSelected(uint256 indexed roundId, address indexed winner, uint256 prizeAmount);
    event PlatformFeeCollected(uint256 indexed roundId, uint256 amount);
    event PlayerRefunded(uint256 indexed roundId, address indexed player, uint256 amount);
    event EntryFeeUpdated(uint256 oldFee, uint256 newFee);
    event PlatformFeeUpdated(uint256 oldFee, uint256 newFee);
    event SystemPaused(address indexed by);
    event SystemUnpaused(address indexed by);
    event ProtocolFeeWithdrawn(address indexed to, uint256 amount);
    event CoreUpdated(address indexed newCore);
}
