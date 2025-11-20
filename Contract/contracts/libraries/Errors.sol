// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library Errors {
    error RoundFull();
    error RoundNotFull();
    error RoundAlreadyClosed();
    error RoundNotExpired();
    error RoundExpired();
    error RoundNotStarted();
    error RoundInProgress();
    error InvalidRoundId();

    error InvalidEntryFee();
    error ZeroEntry();
    error NotEnoughPlayers();
    error TransferFailed();
    error RefundFailed();

    error NotOwner();
    error InvalidFeePercentage();
    error SystemPaused();
    error SystemNotPaused();

    error RandomNotRequested();
    error RandomAlreadyRequested();
    error RandomPending();
    error InvalidRandomResponse();

    error NotAuthorized();
    error OnlyCoreCanCall();
    error OnlyManagerCanCall();

    error InvalidAddress();
    error InvalidOperation();
    error InvalidState();
    error InvalidCloseTime();
}
