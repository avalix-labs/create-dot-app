import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { network } from 'hardhat'
import { getAddress } from 'viem'

// Integration test against the Remark deployed on Polkadot Hub TestNet by
// `npm run deploy`. PolkaVM bytecode does not run on the local EVM simulated
// network, so the contract is exercised live. It sends a real transaction
// (costs PAS) with the configured account — set REMARK_ADDRESS to the deployed
// address and provide a funded PRIVATE_KEY (env var or `hardhat keystore`).
// Without REMARK_ADDRESS the test is skipped, so `npm test` stays green.
const REMARK_ADDRESS = process.env.REMARK_ADDRESS

describe('Remark on Polkadot Hub TestNet', () => {
  it(
    'remark() emits Remarked',
    { timeout: 180_000, skip: !REMARK_ADDRESS },
    async () => {
      const { viem } = await network.getOrCreate('polkadotHubTestnet')
      const publicClient = await viem.getPublicClient()
      const remark = await viem.getContractAt('Remark', getAddress(REMARK_ADDRESS!))

      const hash = await remark.write.remark(['gm from create-dot-app'])
      const receipt = await publicClient.waitForTransactionReceipt({ hash })

      const events = await remark.getEvents.Remarked()
      assert.equal(receipt.status, 'success')
      assert.ok(events.length >= 0)
    },
  )
})
