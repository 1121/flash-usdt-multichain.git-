// Frontend App for Flash USDT/USDC Minting
let provider, signer, contractUSDT, contractUSDC;
let currentTokenType = "USDC"; // Default to USDC

// Contract addresses - update after deployment
const CONTRACT_ADDRESSES = {
    polygon: {
        USDT: "YOUR_DEPLOYED_USDT_ADDRESS_POLYGON",
        USDC: "YOUR_DEPLOYED_USDC_ADDRESS_POLYGON"
    },
    bsc: {
        USDT: "YOUR_DEPLOYED_USDT_ADDRESS_BSC",
        USDC: "YOUR_DEPLOYED_USDC_ADDRESS_BSC"
    }
};

// Contract ABIs
const ABI_USDT = [
    "function flashMint(address to, uint256 amount) external",
    "function flashTransfer(address to, uint256 amount) external",
    "function burn(address from, uint256 amount) external",
    "function balanceOf(address account) external view returns (uint256)",
    "function approve(address spender, uint256 amount) external returns (bool)"
];

const ABI_USDC = [
    "function usdcMint(address to, uint256 amount) external",
    "function usdcTransfer(address to, uint256 amount) external",
    "function burn(address from, uint256 amount) external",
    "function burnUSDC(uint256 amount) external",
    "function flashMint(address to, uint256 amount, bytes calldata data) external",
    "function balanceOf(address account) external view returns (uint256)",
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function decimals() external pure returns (uint8)"
];

/**
 * Validate an Ethereum address
 * @param {string} address - Address to validate
 * @returns {boolean} True if valid, false otherwise
 */
function isValidAddress(address) {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validate amount input
 * @param {string} amount - Amount string to validate
 * @returns {boolean} True if valid, false otherwise
 */
function isValidAmount(amount) {
    const num = parseFloat(amount);
    return !isNaN(num) && num > 0;
}

/**
 * Connect to the user's Web3 wallet
 */
async function connectWallet() {
    try {
        if (!window.ethereum) {
            alert("MetaMask or another Web3 wallet is required!");
            return;
        }

        provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();
        const userAddress = await signer.getAddress();
        const network = await provider.getNetwork();

        // Initialize contracts
        const networkName = network.name === "homestead" ? "mainnet" : network.name;
        console.log(`Connected to ${networkName} with address: ${userAddress}`);

        // For now, use Polygon as default
        const addresses = CONTRACT_ADDRESSES.polygon;
        contractUSDT = new ethers.Contract(addresses.USDT, ABI_USDT, signer);
        contractUSDC = new ethers.Contract(addresses.USDC, ABI_USDC, signer);

        document.getElementById("walletStatus").innerText = `✅ Connected: ${userAddress.substring(0, 6)}...${userAddress.substring(38)}`;
        document.getElementById("networkStatus").innerText = `📍 Network: ${networkName}`;
        alert(`Wallet connected! Address: ${userAddress}`);
    } catch (error) {
        console.error("Wallet connection error:", error);
        alert("Failed to connect wallet: " + error.message);
    }
}

/**
 * Mint USDC tokens
 */
async function mintUSDC() {
    try {
        if (!signer) {
            alert("Please connect your wallet first!");
            return;
        }

        const recipient = document.getElementById("recipient").value.trim();
        const amountInput = document.getElementById("amount").value.trim();

        // Validation
        if (!recipient) {
            alert("Please enter a recipient address");
            return;
        }

        if (!isValidAddress(recipient)) {
            alert("Invalid recipient address. Must be a valid Ethereum address (0x...)");
            return;
        }

        if (!amountInput) {
            alert("Please enter an amount");
            return;
        }

        if (!isValidAmount(amountInput)) {
            alert("Invalid amount. Must be a positive number");
            return;
        }

        // USDC uses 6 decimals
        const amount = ethers.utils.parseUnits(amountInput, 6);
        const senderAddress = await signer.getAddress();

        console.log(`Minting ${amountInput} USDC to ${recipient}`);
        
        // Check if sender is the owner (only owner can mint)
        document.getElementById("status").innerText = "⏳ Processing USDC mint...";

        const mintTx = await contractUSDC.usdcMint(recipient, amount);
        console.log("Mint transaction sent:", mintTx.hash);
        
        document.getElementById("status").innerText = "⏳ Waiting for mint confirmation...";
        const receipt = await mintTx.wait();
        
        console.log("Mint transaction confirmed:", receipt.transactionHash);
        document.getElementById("status").innerText = `✅ Successfully minted ${amountInput} USDC to ${recipient.substring(0, 6)}...${recipient.substring(38)}`;
        document.getElementById("txHash").innerText = `TX: ${receipt.transactionHash}`;
        
        alert(`✅ USDC minted successfully!\nTX: ${receipt.transactionHash}`);
    } catch (error) {
        console.error("Minting error:", error);
        document.getElementById("status").innerText = "❌ Minting failed";
        alert("Minting failed: " + error.message);
    }
}

/**
 * Transfer USDC tokens
 */
async function transferUSDC() {
    try {
        if (!signer) {
            alert("Please connect your wallet first!");
            return;
        }

        const recipient = document.getElementById("recipient").value.trim();
        const amountInput = document.getElementById("amount").value.trim();

        // Validation
        if (!recipient) {
            alert("Please enter a recipient address");
            return;
        }

        if (!isValidAddress(recipient)) {
            alert("Invalid recipient address");
            return;
        }

        if (!amountInput || !isValidAmount(amountInput)) {
            alert("Invalid amount");
            return;
        }

        const amount = ethers.utils.parseUnits(amountInput, 6);
        const senderAddress = await signer.getAddress();

        // Check balance
        const balance = await contractUSDC.balanceOf(senderAddress);
        if (balance.lt(amount)) {
            alert(`Insufficient balance. You have ${ethers.utils.formatUnits(balance, 6)} USDC`);
            return;
        }

        document.getElementById("status").innerText = "⏳ Processing USDC transfer...";

        const transferTx = await contractUSDC.usdcTransfer(recipient, amount);
        console.log("Transfer transaction sent:", transferTx.hash);
        
        document.getElementById("status").innerText = "⏳ Waiting for transfer confirmation...";
        const receipt = await transferTx.wait();
        
        console.log("Transfer transaction confirmed:", receipt.transactionHash);
        document.getElementById("status").innerText = `✅ Successfully transferred ${amountInput} USDC`;
        document.getElementById("txHash").innerText = `TX: ${receipt.transactionHash}`;
        
        alert(`✅ Transfer successful!\nTX: ${receipt.transactionHash}`);
    } catch (error) {
        console.error("Transfer error:", error);
        document.getElementById("status").innerText = "❌ Transfer failed";
        alert("Transfer failed: " + error.message);
    }
}

/**
 * Burn USDC tokens
 */
async function burnUSDC() {
    try {
        if (!signer) {
            alert("Please connect your wallet first!");
            return;
        }

        const amountInput = document.getElementById("amount").value.trim();

        if (!amountInput || !isValidAmount(amountInput)) {
            alert("Invalid amount");
            return;
        }

        const amount = ethers.utils.parseUnits(amountInput, 6);
        const senderAddress = await signer.getAddress();

        // Check balance
        const balance = await contractUSDC.balanceOf(senderAddress);
        if (balance.lt(amount)) {
            alert(`Insufficient balance. You have ${ethers.utils.formatUnits(balance, 6)} USDC`);
            return;
        }

        document.getElementById("status").innerText = "⏳ Processing USDC burn...";

        const burnTx = await contractUSDC.burnUSDC(amount);
        console.log("Burn transaction sent:", burnTx.hash);
        
        document.getElementById("status").innerText = "⏳ Waiting for burn confirmation...";
        const receipt = await burnTx.wait();
        
        console.log("Burn transaction confirmed:", receipt.transactionHash);
        document.getElementById("status").innerText = `✅ Successfully burned ${amountInput} USDC`;
        document.getElementById("txHash").innerText = `TX: ${receipt.transactionHash}`;
        
        alert(`✅ Burn successful!\nTX: ${receipt.transactionHash}`);
    } catch (error) {
        console.error("Burn error:", error);
        document.getElementById("status").innerText = "❌ Burn failed";
        alert("Burn failed: " + error.message);
    }
}

/**
 * Execute a complete flash USDC operation: mint -> transfer -> burn
 */
async function flashMintAndTransfer() {
    try {
        if (!signer) {
            alert("Please connect your wallet first!");
            return;
        }

        const recipient = document.getElementById("recipient").value.trim();
        const amountInput = document.getElementById("amount").value.trim();

        // Validation
        if (!recipient) {
            alert("Please enter a recipient address");
            return;
        }

        if (!isValidAddress(recipient)) {
            alert("Invalid recipient address");
            return;
        }

        if (!amountInput || !isValidAmount(amountInput)) {
            alert("Invalid amount");
            return;
        }

        const amount = ethers.utils.parseUnits(amountInput, 6);
        const senderAddress = await signer.getAddress();

        document.getElementById("status").innerText = "⏳ Step 1/3: Minting USDC...";

        // Step 1: Mint
        const mintTx = await contractUSDC.usdcMint(senderAddress, amount);
        await mintTx.wait();
        console.log("✅ Mint complete");

        document.getElementById("status").innerText = "⏳ Step 2/3: Transferring USDC...";

        // Step 2: Transfer
        const transferTx = await contractUSDC.usdcTransfer(recipient, amount);
        await transferTx.wait();
        console.log("✅ Transfer complete");

        document.getElementById("status").innerText = "⏳ Step 3/3: Burning USDC...";

        // Step 3: Burn
        const burnTx = await contractUSDC.burnUSDC(amount);
        await burnTx.wait();
        console.log("✅ Burn complete");

        document.getElementById("status").innerText = `✅ Flash USDC operation complete! Transferred ${amountInput} USDC to ${recipient.substring(0, 6)}...${recipient.substring(38)}`;
        
        alert(`✅ Flash USDC operation successful!\nMinted, transferred, and burned ${amountInput} USDC`);
    } catch (error) {
        console.error("Flash operation error:", error);
        document.getElementById("status").innerText = "❌ Flash operation failed";
        alert("Flash operation failed: " + error.message);
    }
}

/**
 * Check USDC balance for the connected wallet
 */
async function checkBalance() {
    try {
        if (!signer) {
            alert("Please connect your wallet first!");
            return;
        }

        const userAddress = await signer.getAddress();
        const balance = await contractUSDC.balanceOf(userAddress);
        const formattedBalance = ethers.utils.formatUnits(balance, 6);

        document.getElementById("balance").innerText = `💰 Balance: ${formattedBalance} USDC`;
        alert(`Your USDC Balance: ${formattedBalance} USDC`);
    } catch (error) {
        console.error("Balance check error:", error);
        alert("Failed to check balance: " + error.message);
    }
}

// Initialize on page load
window.addEventListener("load", () => {
    console.log("Flash USDC App loaded");
    document.getElementById("walletStatus").innerText = "Not connected";
});
