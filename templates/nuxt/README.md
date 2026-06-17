# create-dot-app — Nuxt (Polkadot Hub)

A [Nuxt](https://nuxt.com) starter for building dapps on **Polkadot Hub**. The first-run
home page is a live welcome screen — a real-time block watcher, a network switcher,
Connect Wallet, and a sample transaction — all wired up so you can confirm the stack
works the moment it boots.

Wallet connection is powered by **Web3Auth (MetaMask Embedded Wallets)** and on-chain
reads/writes by **[@wagmi/vue](https://wagmi.sh/vue)**, pointed at the three Polkadot Hub
EVM networks: Passet Hub Testnet (PAS), Polkadot Hub (DOT), and Kusama Hub (KSM). The
provider tree is rendered client-side (`<ClientOnly>`) since Web3Auth + wagmi are
browser-only, while the document head is served by Nuxt.

## Prerequisites

- Node.js 20+
- npm
- A Client ID from the [Web3Auth Dashboard](https://dashboard.web3auth.io)

## Setup

### 1. Install dependencies

Installs the Nuxt app and the Hardhat workspace under `contracts/` (npm workspaces).

```bash
npm install
```

### 2. Configure environment variables (optional)

A demo Sapphire Devnet Client ID ships as the default in `nuxt.config.ts`, so the app
runs out of the box. To use your own, create a `.env`:

```bash
cp .env.example .env
```

and set:

```
NUXT_PUBLIC_WEB3AUTH_CLIENT_ID=YOUR_CLIENT_ID
```

After deploying on testnet, set Flipper and Remark addresses in [`app/lib/contracts/addresses.ts`](app/lib/contracts/addresses.ts).

> Use **Sapphire Devnet** (the default) for local development — Sapphire Mainnet does
> not allow localhost.

### 3. Run the application

```bash
npm run dev
```

Visit `http://localhost:3000`.

## Project structure

```text
app/
  app.vue               Web3Auth + wagmi provider tree (client-only)
  pages/index.vue       the route rendered at /
  components/
    welcome/            first-run welcome demo (replace with your own UI)
      AppWelcome.vue    ← start here: top bar, hero, features, side rail
      icons/            presentational icon primitives + live dot
    web3/               provider shell + chain restriction
  composables/          useDismissible, useWagmiRemount
  lib/
    web3/               wallet + chain wiring: Web3Auth config, chain configs
    welcome/            theme tokens, network metadata, copy, helpers
    contracts/          contract ABIs + deployed addresses, typed for wagmi
  assets/css/main.css   Tailwind CSS 4 entry + welcome animations
  plugins/vue-query.ts  installs TanStack Query (wagmi's data layer)
config/                 build-time module stubs referenced by nuxt.config.ts
contracts/              Hardhat workspace (npm workspace) — Solidity, tests, deploy
public/                 static assets
```

Imports use Nuxt's `~/*` alias (mapped to `app/`), e.g.
`import { polkadotChains } from "~/lib/web3/chains"`.

## Where to start

Edit [`app/components/welcome/AppWelcome.vue`](app/components/welcome/AppWelcome.vue) — it
composes the welcome screen and is the natural place to start building your own UI. Styling
uses **Tailwind CSS 4** utility classes with theme tokens exposed as CSS variables
(`--paper`, `--ink`, `--acc`, …) on the welcome root. The pieces it pulls in live in
[`app/components/welcome/`](app/components/welcome):

| File | Responsibility |
| --- | --- |
| `AppWelcome.vue` | Top bar, hero, features, side rail; owns theme + selected-network state |
| `welcome/LiveDemo.vue` | Composes `BlockPanel` + `WritePanel` |
| `welcome/BlockPanel.vue` | Live block watcher (`useBlockNumber`) |
| `welcome/WritePanel.vue` | Sample contract writes + transaction stepper |
| `welcome/WalletConnect.vue` | Connect Wallet button + connected menu (Web3Auth + `useBalance`) |
| `welcome/NetworkSwitch.vue` | Network selector (`useSwitchChain`) |
| `welcome/HeaderUtilities.vue` | Accent picker + theme toggle |
| `welcome/PopoverPanel.vue`, `welcome/icons/` | Shared UI primitives (dropdown panel, icon set) |

Providers and chain config live under [`app/components/web3/`](app/components/web3) and
[`app/lib/web3/`](app/lib/web3):

- [`app/app.vue`](app/app.vue) — Web3Auth provider + client-only boundary
- [`app/components/web3/Web3Shell.vue`](app/components/web3/Web3Shell.vue) — wagmi provider + remount wiring
- [`app/components/web3/RestrictPolkadotChains.vue`](app/components/web3/RestrictPolkadotChains.vue) — keeps wagmi to the three Hub chains
- [`app/lib/web3/chains.ts`](app/lib/web3/chains.ts) — the three Polkadot Hub chain configs

## Smart contracts

The [`contracts/`](contracts/) directory is a [Hardhat](https://docs.polkadot.com/smart-contracts/dev-environments/hardhat/) workspace (`hardhat`) in the same npm monorepo as the app. See [`contracts/README.md`](contracts/README.md).

```bash
npm run compile:contracts
npm run test:contracts
npm run deploy:contracts   # requires PRIVATE_KEY — see contracts/README.md
```

`compile:contracts` exports the ABIs to `app/lib/contracts/`.

## Scripts

```bash
npm run dev                # start the dev server
npm run build              # production build
npm run preview            # serve the production build
npm run generate           # static-site (prerender) build
npm run typecheck          # vue-tsc type check
npm run lint               # eslint (@nuxt/eslint flat config)
npm run compile:contracts  # compile Solidity and export ABIs to app/lib/contracts/
npm run test:contracts     # Hardhat tests
npm run deploy:contracts   # deploy Flipper + Remark to Polkadot Hub TestNet
```

This template uses the non-deprecated `@wagmi/vue` APIs — `useConnection`, and `mutate`
from `useSwitchChain` / `useWriteContract` — per the [wagmi migration guide](https://wagmi.sh/react/guides/migrate-from-v2-to-v3).

## Resources

- [Polkadot Smart Contracts docs](https://docs.polkadot.com/develop/smart-contracts/)
- [MetaMask Embedded Wallets / Web3Auth docs](https://docs.metamask.io/embedded-wallets/)
- [wagmi for Vue documentation](https://wagmi.sh/vue)
- [Nuxt documentation](https://nuxt.com/docs)

## License

MIT
