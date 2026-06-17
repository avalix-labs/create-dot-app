import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'

// wagmi's Vue composables read/write through TanStack Query, so the QueryClient
// must be installed app-wide before any of them run. The Web3Auth + wagmi
// providers live under this in the component tree (see app.vue).
export default defineNuxtPlugin((nuxtApp) => {
  const queryClient = new QueryClient()
  nuxtApp.vueApp.use(VueQueryPlugin, { queryClient })
})
