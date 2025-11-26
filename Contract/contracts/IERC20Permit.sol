// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v5.1.0) (token/ERC20/extensions/IERC20Permit.sol)

pragma solidity ^0.8.20;

/**
 * @dev Interface of the ERC-20 Permit extension allowing approvals to be made via signatures, as defined in
 * https://eips.ethereum.org/EIPS/eip-2612[EIP-2612].
 *
 * Adds the {permit} method, which can be used to change an account's ERC20 allowance (see {IERC20-allowance}) by
 * presenting a message signed by the account. By not relying on {IERC20-approve}, the token holder account doesn't
 * need to send a transaction, and can delegate the allowance setting to a third party.
 *
 * Emits {IERC20-Approval} via the underlying {IERC20} contract.
 */
interface IERC20Permit {
    /**
     * @dev Sets `value` as the allowance of `spender` over `owner`'s tokens,
     * given `owner`'s signed approval.
     *
     * IMPORTANT: The `nonce` parameter is unique to each non-permit transaction.
     * An allowance can only be granted once per `nonce`.
     *
     * Emits an {IERC20-Approval} event.
     *
     * Requirements:
     *
     * - `owner` cannot be the zero address.
     * - `spender` cannot be the zero address.
     * - `deadline` must be a future timestamp.
     * - `v`, `r` and `s` must be a valid ECDSA signature from `owner` over the EIP712-formatted function call.
     *   There are three ways to get this signature:
     *   1. Use the `_signTypedData` method in a contract that inherits from `EIP712`.
     *   2. Use the `eth_signTypedData_v4` RPC method in a web3 provider.
     *   3. Use the `sign` method in a web3 provider, but be aware that this is not
     *      EIP712-compliant and may be deprecated in the future.
     */
    function permit(
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external;

    /**
     * @dev Returns the current nonce for `owner`. This value must be included in all signed messages.
     *
     * This function can be changed to `view` in Solidity v0.8.20.
     */
    function nonces(address owner) external view returns (uint256);

    /**
     * @dev Returns the domain separator used in the encoding of the signature for `permit`, as defined in EIP-2612.
     *
     * This function can be changed to `view` in Solidity v0.8.20.
     */
    function DOMAIN_SEPARATOR() external view returns (bytes32);
}
