# Smart contracts (Hardhat 3 + PolkaVM)

Solidity workspace for [Polkadot Hub](https://docs.polkadot.com/smart-contracts/). Contracts are compiled to **PolkaVM** bytecode with [`@avalix/hardhat-polkavm`](https://www.npmjs.com/package/@avalix/hardhat-polkavm) (Parity's `resolc` / revive compiler) — the bytecode Polkadot Hub actually executes.

The default network (`polkadotHubTestnet`) matches **Polkadot Hub TestNet** used by the Nuxt app (`chainId` `420420417` / `0x190f1b41`).

## Prerequisites

- Node.js 22+ (LTS)
- npm

## Setup

From the **project root** (monorepo — `npm install` installs this workspace too):

```bash
npm install
```

Store your deployer private key in Hardhat's encrypted keystore. Run from the project root or from `contracts/`:

```bash
npm exec -w hardhat hardhat keystore set PRIVATE_KEY
```

An exported `PRIVATE_KEY` env var also works as a fallback.

## Scripts

From the project root:

```bash
npm run compile:contracts
npm run test:contracts
npm run deploy:contracts
```

Or from this directory (`contracts/`):

```bash
npm run compile   # compile Solidity to PolkaVM and export ABIs to ../app/lib/contracts/
npm test          # integration tests (see below)
npm run deploy    # deploy Flipper + Remark via Ignition to Polkadot Hub TestNet
```

Deploy requires `PRIVATE_KEY` to be set and the account funded with test PAS ([faucet](https://faucet.polkadot.io/)).

## Tests

PolkaVM bytecode does not run on Hardhat's local EVM simulated network, so the tests exercise the contracts **live** on Polkadot Hub TestNet. Deploy first, then point the tests at the deployed addresses:

```bash
FLIPPER_ADDRESS=0x... REMARK_ADDRESS=0x... npm test
```

Each test is skipped when its address is unset, so a bare `npm test` passes. The live tests send real transactions and spend PAS with the configured account.

## Switch back to EVM

Remove the `resolc` block from [`hardhat.config.ts`](./hardhat.config.ts) to compile with `solc` for the EVM as usual.

## Layout

| Path | Purpose |
| --- | --- |
| `contracts/Flipper.sol` | Boolean flipper — `flipper.flip()` in the welcome demo |
| `contracts/Remark.sol` | On-chain remark — `system.remark()` in the welcome demo |
| `ignition/modules/DemoModule.ts` | Deploys both contracts |
| `test/` | Live integration tests (viem + `node:test`) |
| `hardhat.config.ts` | Plugins, networks, `resolc` (PolkaVM) compiler |
