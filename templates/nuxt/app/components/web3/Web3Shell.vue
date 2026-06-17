<script setup lang="ts">
// Wallet + chain wiring: keeps wagmi restricted to the three Polkadot Hub
// networks and remounts `<WagmiProvider>` whenever that set changes, so wagmi's
// derived config stays in sync with Web3Auth.
import { WagmiProvider } from '@web3auth/modal/vue/wagmi'
import { provideWagmiRemount } from '~/composables/useWagmiRemount'
import { useRestrictPolkadotChains } from '~/composables/useRestrictPolkadotChains'

const { wagmiKey, remountWagmi } = provideWagmiRemount()
useRestrictPolkadotChains(remountWagmi)
</script>

<template>
  <WagmiProvider :key="wagmiKey">
    <slot />
  </WagmiProvider>
</template>
