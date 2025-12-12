require("dotenv").config();

const hre = require("hardhat");

async function main() {
  const rewardPerShareRaw = process.env.REWARD_PER_SHARE;
  const startingDifficultyRaw = process.env.STARTING_DIFFICULTY;

  if (!rewardPerShareRaw || !startingDifficultyRaw) {
    throw new Error(
      "Missing REWARD_PER_SHARE / STARTING_DIFFICULTY in env. Copy .env.example to .env and fill values."
    );
  }

  const rewardPerShare = BigInt(rewardPerShareRaw);
  const startingDifficulty = BigInt(startingDifficultyRaw);

  const PoWRewards = await hre.ethers.getContractFactory("PoWRewards");
  const powRewards = await PoWRewards.deploy(rewardPerShare, startingDifficulty);

  await powRewards.waitForDeployment();

  console.log("PoWRewards deployed to:", await powRewards.getAddress());
  console.log("rewardPerShare:", (await powRewards.rewardPerShare()).toString());
  console.log("difficulty:", (await powRewards.difficulty()).toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
