import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { network } from 'hardhat'
import { getAddress } from 'viem'

// Integration test against the Flipper deployed on Polkadot Hub TestNet by
// `npm run deploy`. PolkaVM bytecode does not run on the local EVM simulated
// network, so the contract is exercised live. It sends a real transaction
// (costs PAS) with the configured account — set FLIPPER_ADDRESS to the deployed
// address and provide a funded PRIVATE_KEY (env var or `hardhat keystore`).
// Without FLIPPER_ADDRESS the test is skipped, so `npm test` stays green.
const FLIPPER_ADDRESS = process.env.FLIPPER_ADDRESS

describe('Flipper on Polkadot Hub TestNet', () => {
  it(
    'flip() toggles get()',
    { timeout: 180_000, skip: !FLIPPER_ADDRESS },
    async () => {
      const { viem } = await network.getOrCreate('polkadotHubTestnet')
      const publicClient = await viem.getPublicClient()
      const flipper = await viem.getContractAt('Flipper', getAddress(FLIPPER_ADDRESS!))

      const before = await flipper.read.get()

      const hash = await flipper.write.flip()
      await publicClient.waitForTransactionReceipt({ hash })

      assert.equal(await flipper.read.get(), !before)
    },
  )
})
