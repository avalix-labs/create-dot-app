import hardhatIgnition from '@nomicfoundation/hardhat-ignition'
import hardhatKeystore from '@nomicfoundation/hardhat-keystore'
import hardhatNodeTestRunner from '@nomicfoundation/hardhat-node-test-runner'
import hardhatViem from '@nomicfoundation/hardhat-viem'
import { configVariable, defineConfig } from 'hardhat/config'
import hardhatPolkaVM from '@avalix/hardhat-polkavm'

// https://docs.polkadot.com/smart-contracts/dev-environments/hardhat/
export default defineConfig({
  plugins: [
    hardhatPolkaVM,
    hardhatKeystore,
    hardhatIgnition,
    hardhatNodeTestRunner,
    hardhatViem,
  ],
  solidity: '0.8.29',
  // The presence of this block switches Solidity compilation from solc (EVM) to
  // resolc (PolkaVM) — the bytecode Polkadot Hub actually runs. Remove it to
  // compile for the EVM as usual.
  resolc: {
    // "npm" is self-contained and works on every platform. Switch to "binary"
    // for the faster native compiler on macOS / Linux x64 / Windows x64.
    compilerSource: 'npm',
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
  networks: {
    // Polkadot Hub TestNet — chainId 420420417 / 0x190f1b41, the chain the
    // Next.js app talks to. Token: PAS · Faucet: https://faucet.polkadot.io/
    polkadotHubTestnet: {
      type: 'http',
      url: 'https://services.polkadothub-rpc.com/testnet',
      chainId: 420420417,
      // Stored in the encrypted keystore: `npx hardhat keystore set PRIVATE_KEY`
      // (see the README). An exported PRIVATE_KEY env var also works.
      accounts: [configVariable('PRIVATE_KEY')],
    },
  },
})
