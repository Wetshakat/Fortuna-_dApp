// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./libraries/Types.sol";
import "./libraries/Errors.sol";
import "./libraries/Events.sol";
import "./IFortunaCore.sol";
import "./IFortunaManager.sol";
import "./FortunaVRF.sol";
import "./access/Admin.sol";

contract FortunaCore is IFortunaCore, Admin {
    IFortunaManager public manager;

    uint256 private _entryFee;
    uint256 private _platformFeeBP;
    bool private _paused;

    uint256 public currentRoundId;
    
    // mapping to store round contract addresses (payable for ease of transfers)
    mapping(uint256 => address payable) public roundContracts;

    address public vrfCoordinator;
    bytes32 public keyHash;
    uint256 public subscriptionId;
    uint32 public callbackGasLimit;
    uint16 public requestConfirmations;
   
    constructor(
        address managerAddress,
        uint256 entryFee,
        uint256 platformFeeBP,
        address vrfCoordinator_,
        bytes32 keyHash_,
        uint256 subscriptionId_,
        uint32 callbackGasLimit_,
        uint16 requestConfirmations_
    ) {
        require(managerAddress != address(0), "InvalidManager");

        manager = IFortunaManager(managerAddress);
        _entryFee = entryFee;
        _platformFeeBP = platformFeeBP;
        _paused = false;

        // Store VRF parameters
        vrfCoordinator = vrfCoordinator_;
        keyHash = keyHash_;
        subscriptionId = subscriptionId_;
        callbackGasLimit = callbackGasLimit_;
        requestConfirmations = requestConfirmations_;

        // NOTE: do NOT call _createNewRound() here to avoid making external calls
        // from the constructor that can revert (e.g. manager permissions). Call
        // createNewRound() after deployment from the admin account.
    }

    modifier notPaused() {
        if (_paused) revert Errors.SystemPaused();
        _;
    }

    function joinRound(uint256 roundId) external payable override notPaused {
        if (msg.value != _entryFee) revert Errors.InvalidEntryFee();
        if (!manager.roundExists(roundId)) revert Errors.InvalidRoundId();

        FortunaVRF roundContract = FortunaVRF(roundContracts[roundId]);
        roundContract.addPlayer{value: msg.value}(msg.sender);

        emit Events.PlayerJoined(roundId, msg.sender, msg.value);

        if (roundContract.isRoundFull() || roundContract.isExpired()) {
            _closeRound(roundId);
        }
    }

    function createNewRound() external override onlyAdmin returns (uint256) {
        return _createNewRound();
    }

    function _createNewRound() internal returns (uint256) {
        currentRoundId += 1;
        uint64 startTime = uint64(block.timestamp);

        // Pass VRF data into the round contract
        FortunaVRF newRound = new FortunaVRF(
            currentRoundId,
            _entryFee,
            startTime,
            address(manager),
            address(this),
            vrfCoordinator,
            keyHash,
            subscriptionId,
            callbackGasLimit,
            requestConfirmations
        );

        roundContracts[currentRoundId] = payable(address(newRound));

        manager.createRound(currentRoundId, startTime + 60, _entryFee, 50);

        emit Events.NewRoundCreated(currentRoundId, block.timestamp);
        return currentRoundId;
    }

    function _closeRound(uint256 roundId) internal {
        FortunaVRF roundContract = FortunaVRF(roundContracts[roundId]);
        roundContract.closeRound();

        emit Events.RoundClosed(
            roundId,
            manager.totalParticipants(roundId),
            roundContract.getPrizePool()
        );

        _createNewRound();
    }

    function getActiveRound() external view override returns (uint256) {
        return currentRoundId;
    }

    function getRoundInfo(uint256 roundId) external view override returns (Types.RoundInfo memory) {
        FortunaVRF roundContract = FortunaVRF(roundContracts[roundId]);
        return roundContract.getRoundInfo();
    }

    function getEntryFee() external view override returns (uint256) {
        return _entryFee;
    }

    function getPlatformBalance() external view override returns (uint256) {
        return manager.getProtocolFees();
    }

    function setEntryFee(uint256 fee) external onlyAdmin {
        uint256 oldFee = _entryFee;
        _entryFee = fee;
        emit Events.EntryFeeUpdated(oldFee, fee);
    }

    function withdrawPlatformFees(address to) external onlyAdmin {
        manager.withdrawProtocolFees(to);
    }

    function pause() external onlyAdmin {
        _paused = true;
        emit Events.SystemPaused(msg.sender);
    }

    function unpause() external onlyAdmin {
        _paused = false;
        emit Events.SystemUnpaused(msg.sender);
    }
}
