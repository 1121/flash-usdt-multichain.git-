const hre = require("hardhat");

async function main() {
    const FlashUSDT = await hre.ethers.getContractFactory("FlashUSDT");
    const flash = await FlashUSDT.deploy();
    await flash.deployed();
    console.log("FlashUSDT deployed to:", flash.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
