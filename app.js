// File: frontend/app.js

let provider, signer, contract;
const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS"; // replace after deploy
const ABI = [
    "function flashMint(address to, uint256 amount) external",
    "function flashTransfer(address to, uint256 amount) external",
    "function burn(address from, uint256 amount) external"
];

async function connectWallet() {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    alert("Wallet connected!");
}

async function flashMintAndTransfer() {
    const recipient = document.getElementById("recipient").value;
    const amount = ethers.utils.parseUnits("100", 18);

    try {
        const mintTx = await contract.flashMint(await signer.getAddress(), amount);
        await mintTx.wait();

        const transferTx = await contract.flashTransfer(recipient, amount);
await transferTx.wait();

        const burnTx = await contract.burn(await signer.getAddress(), amount);
        await burnTx.wait();

        alert("Flash USDT transferred and burned.");
    } catch (err) {
        console.error(err);
        alert("Transaction failed");
    }
}
