// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract PoWRewards is Ownable {
    uint256 public rewardPerShare;
    uint256 public difficulty;

    event ParametersUpdated(uint256 rewardPerShare, uint256 difficulty);

    constructor(uint256 _rewardPerShare, uint256 _startingDifficulty) Ownable(msg.sender) {
        rewardPerShare = _rewardPerShare;
        difficulty = _startingDifficulty;
        emit ParametersUpdated(rewardPerShare, difficulty);
    }

    function setRewardPerShare(uint256 _rewardPerShare) external onlyOwner {
        rewardPerShare = _rewardPerShare;
        emit ParametersUpdated(rewardPerShare, difficulty);
    }

    function setDifficulty(uint256 _difficulty) external onlyOwner {
        difficulty = _difficulty;
        emit ParametersUpdated(rewardPerShare, difficulty);
    }
}
