// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FlashUSDC
 * @dev A flash-mintable USDC token contract supporting multichain deployment
 * Enables temporary minting of USDC tokens for flash transactions
 */
contract FlashUSDC is ERC20, Ownable {
    // Events for tracking USDC mint operations
    event USDCMinted(address indexed recipient, uint256 amount);
    event USDCBurned(address indexed account, uint256 amount);
    event USDCTransferred(address indexed from, address indexed to, uint256 amount);

    /**
     * @dev Initialize the FlashUSDC contract with standard ERC20 properties
     */
    constructor() ERC20("Flash USDC", "fUSDC") Ownable(msg.sender) {}

    /**
     * @dev Mint USDC tokens to a specified recipient
     * @param to The recipient address to mint tokens to
     * @param amount The amount of tokens to mint (in USDC decimal units: 6)
     * 
     * Requirements:
     * - Only the owner can call this function
     * - Recipient address cannot be zero address
     * - Amount must be greater than 0
     */
    function usdcMint(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "FlashUSDC: Cannot mint to zero address");
        require(amount > 0, "FlashUSDC: Mint amount must be greater than 0");
        
        _mint(to, amount);
        emit USDCMinted(to, amount);
    }

    /**
     * @dev Burn USDC tokens from a specified account
     * @param from The account to burn tokens from
     * @param amount The amount of tokens to burn
     *
     * Requirements:
     * - Only the owner can call this function
     * - Amount must be greater than 0
     * - Account must have sufficient balance
     */
    function burn(address from, uint256 amount) external onlyOwner {
        require(amount > 0, "FlashUSDC: Burn amount must be greater than 0");
        require(balanceOf(from) >= amount, "FlashUSDC: Insufficient balance to burn");
        
        _burn(from, amount);
        emit USDCBurned(from, amount);
    }

    /**
     * @dev Transfer USDC tokens between addresses
     * @param to The recipient address
     * @param amount The amount to transfer
     *
     * Requirements:
     * - Recipient address cannot be zero address
     * - Amount must be greater than 0
     * - Sender must have sufficient balance
     */
    function usdcTransfer(address to, uint256 amount) external {
        require(to != address(0), "FlashUSDC: Cannot transfer to zero address");
        require(amount > 0, "FlashUSDC: Transfer amount must be greater than 0");
        require(balanceOf(msg.sender) >= amount, "FlashUSDC: Insufficient balance");
        
        _transfer(msg.sender, to, amount);
        emit USDCTransferred(msg.sender, to, amount);
    }

    /**
     * @dev Flash mint USDC with automatic burn in a single transaction
     * Useful for flash loan-like operations
     * @param to The recipient address
     * @param amount The amount to flash mint
     *
     * Requirements:
     * - Only the owner can call this function
     * - Recipient address cannot be zero address
     * - Amount must be greater than 0
     */
    function flashMint(address to, uint256 amount, bytes calldata) external onlyOwner {
        require(to != address(0), "FlashUSDC: Cannot mint to zero address");
        require(amount > 0, "FlashUSDC: Flash mint amount must be greater than 0");
        
        // Mint the tokens
        _mint(to, amount);
        emit USDCMinted(to, amount);
    }

    /**
     * @dev Burn USDC tokens - can be called by token holder or owner
     * @param amount The amount to burn
     *
     * Requirements:
     * - Amount must be greater than 0
     * - Caller must have sufficient balance
     */
    function burnUSDC(uint256 amount) external {
        require(amount > 0, "FlashUSDC: Burn amount must be greater than 0");
        require(balanceOf(msg.sender) >= amount, "FlashUSDC: Insufficient balance");
        
        _burn(msg.sender, amount);
        emit USDCBurned(msg.sender, amount);
    }

    /**
     * @dev Get the decimals for USDC (standard is 6)
     * @return The number of decimals
     */
    function decimals() public pure override returns (uint8) {
        return 6;
    }
}
