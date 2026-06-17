<script setup lang="ts">
import { Web3AuthProvider } from '@web3auth/modal/vue'
import Web3Shell from '~/components/web3/Web3Shell.vue'
import { createWeb3AuthConfig } from '~/lib/web3/config'

// Web3Auth + wagmi are browser-only; the app is a client-rendered SPA (see
// `ssr: false` in nuxt.config.ts). The static document head lives there too.
const runtimeConfig = useRuntimeConfig()
const web3AuthContextConfig = createWeb3AuthConfig(runtimeConfig.public.web3authClientId)
</script>

<template>
  <Web3AuthProvider :config="web3AuthContextConfig">
    <Web3Shell>
      <NuxtPage />
    </Web3Shell>
  </Web3AuthProvider>
</template>
