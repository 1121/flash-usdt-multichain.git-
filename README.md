# Flash USDC - Multichain Minting Platform

A comprehensive Solidity-based ERC20 token minting platform with support for Flash USDT and Flash USDC tokens across multiple blockchain networks.

## 🎯 Overview

Flash USDC is a powerful tool for:
- **Flash minting** of USDC tokens with full validation
- **Multichain deployment** across Polygon, BSC, Ethereum, Arbitrum, and Avalanche
- **Temporary token operations** useful for flash loans and arbitrage strategies
- **User-friendly interface** for wallet connection and token operations

## ✨ Features

### Core Functionality
✅ **Flash USDC Contract**
- ERC20-compliant token with 6 decimal precision (standard for USDC)
- Owner-only minting with comprehensive validation
- Event logging for all operations (USDCMinted, USDCBurned, USDCTransferred)
- Flash mint capability for advanced use cases

✅ **Flash USDT Contract**
- Legacy support for Flash USDT tokens
- Compatible with existing infrastructure
- Full ERC20 interface implementation

✅ **Multichain Support**
- Polygon (Matic)
- Binance Smart Chain (BSC)
- Ethereum Mainnet
- Arbitrum
- Avalanche (C-Chain)

✅ **Web3 Frontend**
- MetaMask/Web3 wallet integration
- Real-time balance checking
- Transaction status tracking
- Responsive design for desktop and mobile

## 📋 Project Structure

```
flash-usdc-multichain/
├── FlashUSDC.sol           # USDC token contract with minting
├── FlashUSDT.sol           # Legacy USDT token contract
├── deploy.js               # Hardhat deployment script
├── hardhat.config.js       # Network configuration
├── package.json            # Dependencies
├── index.html              # Frontend UI
├── app.js                  # Frontend application logic
├── .env                    # Environment variables (not committed)
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn
- MetaMask or compatible Web3 wallet
- Private key for contract deployment (with testnet funds)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-repo/flash-usdc-multichain.git
cd flash-usdc-multichain

# Install dependencies
npm install
```

### Environment Setup

Create a `.env` file in the root directory:

```bash
PRIVATE_KEY=your_wallet_private_key_here
```

⚠️ **Security Warning**: Never commit `.env` to version control. Always use a testnet private key.

### Compilation

```bash
# Compile smart contracts
npm run compile
```

### Deployment

Deploy to specific networks:

```bash
# Deploy to Polygon
npx hardhat run deploy.js --network polygon

# Deploy to BSC
npx hardhat run deploy.js --network bsc

# Deploy to Ethereum
npx hardhat run deploy.js --network ethereum

# Deploy to Arbitrum
npx hardhat run deploy.js --network arbitrum

# Deploy to Avalanche
npx hardhat run deploy.js --network avalanche
```

The deployment script will:
1. Deploy FlashUSDT contract
2. Deploy FlashUSDC contract
3. Output contract addresses for both tokens
4. Display deployment summary with network info and timestamp

### Frontend Setup

After deployment:

1. **Update Contract Addresses**
   - Copy the deployed USDC contract address
   - Update `app.js` → `CONTRACT_ADDRESSES` object with your deployed addresses

2. **Run Frontend**
   - Open `index.html` in a web browser
   - Ensure MetaMask is installed and connected to the correct network

## 📝 Smart Contract API

### FlashUSDC Contract

#### `usdcMint(address to, uint256 amount)`
Mint USDC tokens to a recipient address.

**Parameters:**
- `to` - Recipient Ethereum address (must be valid, not 0x0)
- `amount` - Number of tokens to mint (in USDC units, 6 decimals)

**Example:**
```solidity
// Mint 100 USDC (with 6 decimals)
usdcMint(0x742d35Cc6634C0532925a3b844Bc9e7595f, 100000000);
```

**Requirements:**
- Only contract owner can call this function
- Recipient address cannot be zero address
- Amount must be greater than 0

**Events:**
- Emits `USDCMinted(address indexed recipient, uint256 amount)`

#### `usdcTransfer(address to, uint256 amount)`
Transfer USDC tokens to another address.

**Parameters:**
- `to` - Recipient address
- `amount` - Amount to transfer

**Requirements:**
- Recipient address cannot be zero address
- Caller must have sufficient balance
- Amount must be greater than 0

**Events:**
- Emits `USDCTransferred(address indexed from, address indexed to, uint256 amount)`

#### `burn(address from, uint256 amount)`
Owner-only function to burn tokens from an account.

**Parameters:**
- `from` - Account to burn tokens from
- `amount` - Amount to burn

**Requirements:**
- Only contract owner can call
- Account must have sufficient balance

**Events:**
- Emits `USDCBurned(address indexed account, uint256 amount)`

#### `burnUSDC(uint256 amount)`
Allow token holders to self-burn their tokens.

**Parameters:**
- `amount` - Amount to burn

**Requirements:**
- Caller must have sufficient balance
- Amount must be greater than 0

#### `flashMint(address to, uint256 amount, bytes calldata data)`
Advanced flash minting capability.

**Parameters:**
- `to` - Recipient address
- `amount` - Amount to mint
- `data` - Encoded call data for future extensions

**Requirements:**
- Only contract owner can call

#### `decimals() → uint8`
Returns the token decimal precision (always 6 for USDC compatibility).

## 🎮 Frontend Operations

### 1. **Connect Wallet**
- Click "Connect Wallet" button
- Approve MetaMask connection
- Displays connected address and network

### 2. **Mint USDC**
- Enter recipient address (0x format)
- Enter amount in USDC
- Click "Mint USDC" button
- Transaction confirmation required

**Input Validation:**
- ✓ Valid Ethereum address format (0x followed by 40 hex chars)
- ✓ Amount is a positive number
- ✓ Non-zero recipient address

### 3. **Transfer USDC**
- Enter recipient address
- Enter amount
- Click "Transfer" button
- Balance is checked before transfer

**Validation:**
- ✓ Valid address and amount
- ✓ Sufficient balance check

### 4. **Flash Operation (Mint → Transfer → Burn)**
- Enter recipient address and amount
- Click "Flash Mint & Transfer"
- Automatically executes three-step sequence:
  1. Mint tokens to contract owner
  2. Transfer to recipient
  3. Burn remaining tokens

### 5. **Check Balance**
- Click "Check Balance" button
- Displays total USDC balance for connected wallet
- Balance shown in USDC units (6 decimals)

### 6. **Burn USDC**
- Enter amount to burn
- Click "Burn USDC"
- Tokens are burned from your account

## 🔐 Security Considerations

### Best Practices

1. **Private Key Management**
   - Use testnet keys only for development
   - Store mainnet keys in secure vaults (Ledger, Trezor, etc.)
   - Never commit `.env` files

2. **Input Validation**
   - All addresses are validated before transaction
   - Amount inputs checked for positivity and validity
   - Recipient address cannot be zero address

3. **Access Control**
   - Only contract owner can mint tokens
   - Standard OpenZeppelin `Ownable` pattern
   - Ownership can be transferred via `transferOwnership()`

4. **Transaction Safety**
   - All operations emit events for tracking
   - Transaction receipts stored and displayed
   - Error messages provide debugging information

### Contract Audits
- Uses OpenZeppelin audited contracts (ERC20, Ownable)
- Solidity 0.8.20 with overflow protection
- All functions include comprehensive validation

## 📊 Minting Parameters Reference

| Parameter | Type | Constraints | Example |
|-----------|------|-------------|---------|
| `address` | string | Valid 0x address, 40 hex chars | 0x742d35Cc6634C0532925a3b844Bc9e7595f |
| `amount` | number | Positive integer, > 0 | 100, 1000.50 |
| `decimals` | constant | Always 6 for USDC | - |

### Amount Conversion Examples

```javascript
// JavaScript with ethers.js
const ethers = require('ethers');

// Mint 100 USDC
const amount = ethers.utils.parseUnits("100", 6);  // 100000000

// Mint 50.5 USDC
const amount = ethers.utils.parseUnits("50.5", 6); // 50500000

// Display formatted amount
const displayAmount = ethers.utils.formatUnits("100000000", 6); // "100"
```

```solidity
// Solidity
// Mint 100 USDC (with 6 decimals)
usdcMint(recipient, 100000000);
```

## 🌐 Network RPC Endpoints

All networks are pre-configured with public RPC endpoints:

- **Polygon**: https://polygon-rpc.com
- **BSC**: https://bsc-dataseed.binance.org/
- **Ethereum**: https://eth-mainnet.g.alchemy.com/v2/demo (rate limited)
- **Arbitrum**: https://arb1.arbitrum.io/rpc
- **Avalanche**: https://api.avax.network/ext/bc/C/rpc

For production, use dedicated RPC providers:
- Alchemy
- Infura
- QuickNode
- Ankr

## 🐛 Troubleshooting

### Issue: "Cannot mint to zero address"
**Solution:** Verify you entered a valid recipient address starting with `0x`

### Issue: "Insufficient balance to burn"
**Solution:** Check your balance first using "Check Balance" button

### Issue: "MetaMask is not installed"
**Solution:** Install MetaMask browser extension from metamask.io

### Issue: "Sender is not the owner"
**Solution:** Only the contract owner can mint. Connect with the owner's wallet.

### Issue: Transaction fails with "Invalid amount"
**Solution:** Amount must be a positive number greater than 0

## 📚 Additional Resources

- [Solidity Documentation](https://docs.soliditylang.org/)
- [OpenZeppelin ERC20](https://docs.openzeppelin.com/contracts/latest/erc20/)
- [Hardhat Documentation](https://hardhat.org/docs)
- [ethers.js Documentation](https://docs.ethers.io/v5/)
- [MetaMask Developer Docs](https://docs.metamask.io/)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues, questions, or suggestions:
1. Check the Troubleshooting section above
2. Review contract events and transaction receipts
3. Open an issue on GitHub
4. Contact the development team

## ⚠️ Disclaimer

This project is provided for educational and testing purposes. Users are responsible for:
- Securing their private keys
- Testing thoroughly on testnets before mainnet deployment
- Understanding smart contract risks and limitations
- Complying with local regulations

---

**Version:** 1.0.0  
**Last Updated:** 2024  
**Maintainer:** Flash USDC Team
