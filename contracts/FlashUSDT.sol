// File: contracts/FlashUSDT.sol

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FlashUSDT is ERC20, Ownable {
    constructor() ERC20("Flash USDT", "fUSDT") Ownable(msg.sender) {}

    function flashMint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external onlyOwner {
        _burn(from, amount);
    }

    function flashTransfer(address to, uint256 amount) external {
        _transfer(msg.sender, to, amount);
    }
}
