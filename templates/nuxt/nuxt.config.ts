import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },

  // Web3Auth + wagmi are browser-only, so the app runs as a client-rendered SPA.
  // Nuxt still serves a fast static shell (head, fonts) before the app boots.
  ssr: false,

  modules: ['@nuxt/eslint'],

  css: ['~/assets/css/main.css'],

  // Exposed to the client as `useRuntimeConfig().public.web3authClientId`.
  // The default is a demo Sapphire Devnet Client ID for quick local testing —
  // get your own at https://dashboard.web3auth.io and override it with
  // NUXT_PUBLIC_WEB3AUTH_CLIENT_ID in .env.
  runtimeConfig: {
    public: {
      web3authClientId:
        'BHgArYmWwSeq21czpcarYh0EVq2WWOzflX-NTK-tY1-1pauPzHKRRLgpABkmYiIV_og9jAvoIxQ8L3Smrwe04Lw',
    },
  },

  app: {
    head: {
      title: 'create-dot-app · Welcome',
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Polkadot-native dapp starter — wallet connection, type-safe hooks and deploy scripts, already wired together.',
        },
      ],
      link: [
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap',
        },
      ],
    },
  },

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      // Optional dependencies of Web3Auth / wagmi that aren't used in the
      // browser bundle — stub them out so Vite doesn't try to bundle them.
      alias: {
        'pino-pretty': fileURLToPath(new URL('./config/empty-module.js', import.meta.url)),
        '@react-native-async-storage/async-storage': fileURLToPath(
          new URL('./config/empty-module.js', import.meta.url),
        ),
        '@metamask/sdk-analytics': fileURLToPath(
          new URL('./config/metamask-analytics-stub.js', import.meta.url),
        ),
      },
    },
    optimizeDeps: {
      // Pre-bundle the heavier web3 deps so dev server cold starts stay fast.
      include: ['@web3auth/modal', '@wagmi/vue', '@tanstack/vue-query', 'viem'],
    },
  },
})
