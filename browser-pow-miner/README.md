# browser-pow-miner

A standalone Hardhat repo stub intended to house a browser-based proof-of-work miner + its associated smart contracts.

## Setup

```bash
cd browser-pow-miner
npm i
cp .env.example .env
```

Fill in:

- `POLYGON_RPC_URL`, `BSC_RPC_URL`
- `PRIVATE_KEY`
- `REWARD_PER_SHARE`, `STARTING_DIFFICULTY`

## Compile / Test

```bash
npm run compile
npm test
```

## Deploy

```bash
npm run deploy:polygon
npm run deploy:bsc
```

## Structure

- `contracts/` Solidity contracts
- `scripts/` Hardhat scripts (deploy, admin tasks, etc.)
- `test/` Hardhat tests
- `frontend/` Static frontend stub
