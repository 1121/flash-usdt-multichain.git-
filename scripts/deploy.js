const hre = require("hardhat");

async function main() {
    const network = hre.network.name;
    console.log(`\n📦 Deploying Flash tokens on ${network}...`);

    // Deploy FlashUSDT
    console.log("\n🔄 Deploying FlashUSDT...");
    const FlashUSDT = await hre.ethers.getContractFactory("FlashUSDT");
    const flashUSDT = await FlashUSDT.deploy();
    await flashUSDT.deployed();
    console.log("✅ FlashUSDT deployed to:", flashUSDT.address);

    // Deploy FlashUSDC
    console.log("\n🔄 Deploying FlashUSDC...");
    const FlashUSDC = await hre.ethers.getContractFactory("FlashUSDC");
    const flashUSDC = await FlashUSDC.deploy();
    await flashUSDC.deployed();
    console.log("✅ FlashUSDC deployed to:", flashUSDC.address);

    // Save deployment addresses for reference
    const deploymentInfo = {
        network: network,
        timestamp: new Date().toISOString(),
        FlashUSDT: flashUSDT.address,
        FlashUSDC: flashUSDC.address
    };

    console.log("\n📋 Deployment Summary:");
    console.log(JSON.stringify(deploymentInfo, null, 2));
    console.log("\n⚠️  Update CONTRACT_ADDRESS in app.js and hardhat.config.js as needed");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
