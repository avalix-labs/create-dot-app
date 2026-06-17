import { WEB3AUTH_NETWORK } from '@web3auth/modal'
import type { Web3AuthContextConfig } from '@web3auth/modal/vue'
import { polkadotChains, polkadotHubTestnet } from './chains'

/**
 * Build the Web3Auth context config for the Vue `<Web3AuthProvider>`.
 * The client id comes from `useRuntimeConfig().public.web3authClientId`
 * (see nuxt.config.ts / NUXT_PUBLIC_WEB3AUTH_CLIENT_ID).
 */
export function createWeb3AuthConfig(clientId: string): Web3AuthContextConfig {
  return {
    web3AuthOptions: {
      clientId,
      web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
      chains: [...polkadotChains],
      defaultChainId: polkadotHubTestnet.chainId,
      ssr: false,
      disableAnalytics: true,
    },
  }
}
