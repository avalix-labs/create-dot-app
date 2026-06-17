import { watch } from 'vue'
import { useWeb3Auth } from '@web3auth/modal/vue'
import { polkadotChains } from '~/lib/web3/chains'

/**
 * Web3Auth merges dashboard chains with code config. Force coreOptions to only
 * the three Polkadot Hub networks so wagmi does not list Ethereum or others.
 * Calls `remountWagmi` when it has to drop extra chains, so the wagmi config is
 * rebuilt from the restricted set. Must run inside `<Web3AuthProvider>`.
 */
export function useRestrictPolkadotChains(remountWagmi: () => void) {
  const { web3Auth, isInitialized } = useWeb3Auth()

  watch(
    isInitialized,
    (initialized) => {
      const instance = web3Auth.value
      if (!initialized || !instance) return

      const allowed = new Set(polkadotChains.map((chain) => chain.chainId))
      const merged = instance.coreOptions.chains ?? []
      const hasExtraChains
        = merged.length !== polkadotChains.length
          || merged.some((chain) => !allowed.has(chain.chainId))

      if (hasExtraChains) {
        // Web3Auth exposes mutable coreOptions; reassignment is required to drop dashboard chains.
        instance.coreOptions.chains = [...polkadotChains]
        remountWagmi()
      }
    },
    { immediate: true },
  )
}
