// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Admin
 * @notice Provides basic ownership and admin role functionality.
 */
contract Admin {
    address public owner;
    mapping(address => bool) public admins;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event AdminAdded(address indexed admin);
    event AdminRemoved(address indexed admin);

    modifier onlyOwner() {
        require(msg.sender == owner, "Admin: caller is not the owner");
        _;
    }

    modifier onlyAdmin() {
        require(admins[msg.sender] || msg.sender == owner, "Admin: caller is not admin");
        _;
    }

    constructor() {
        owner = msg.sender;
        emit OwnershipTransferred(address(0), owner);
    }

    /* -------------------------------------------------------------------------- */
    /*                                 OWNER FUNCTIONS                             */
    /* -------------------------------------------------------------------------- */

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Admin: new owner is zero address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    /* -------------------------------------------------------------------------- */
    /*                                 ADMIN MANAGEMENT                            */
    /* -------------------------------------------------------------------------- */

    function addAdmin(address admin) external onlyOwner {
        require(admin != address(0), "Admin: zero address");
        admins[admin] = true;
        emit AdminAdded(admin);
    }

    function removeAdmin(address admin) external onlyOwner {
        admins[admin] = false;
        emit AdminRemoved(admin);
    }
}
