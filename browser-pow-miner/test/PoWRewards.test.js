const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PoWRewards", function () {
  it("deploys with provided parameters", async function () {
    const rewardPerShare = 123n;
    const startingDifficulty = 456n;

    const PoWRewards = await ethers.getContractFactory("PoWRewards");
    const powRewards = await PoWRewards.deploy(rewardPerShare, startingDifficulty);
    await powRewards.waitForDeployment();

    expect(await powRewards.rewardPerShare()).to.equal(rewardPerShare);
    expect(await powRewards.difficulty()).to.equal(startingDifficulty);
  });
});
