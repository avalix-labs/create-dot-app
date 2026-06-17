<script setup lang="ts">
// Editorial first-run welcome screen for create-dot-app. Reproduces the design
// 1:1 (layout, type, accent picker, light/dark), with the live block watcher,
// network switch, Connect Wallet, and sample transaction wired to the template's
// real wagmi + Web3Auth composables.
import { computed, ref } from 'vue'
import { useSwitchChain } from '@wagmi/vue'
import { DEFAULT_ACCENT, themeVars, tokens } from '~/lib/welcome/theme'
import { NETWORKS, networkByChainId } from '~/lib/welcome/networks'
import { CLI, FEATURES, HEADLINE, HERO_BLURB, RESOURCES } from '~/lib/welcome/data'
import HeaderUtilities from './HeaderUtilities.vue'
import NetworkSwitch from './NetworkSwitch.vue'
import WalletConnect from './WalletConnect.vue'
import LiveDemo from './LiveDemo.vue'
import IcArrow from './icons/IcArrow.vue'

const dark = ref(false)
const accent = ref(DEFAULT_ACCENT)
const chainId = ref(NETWORKS[0]!.chainId)

const { mutate: switchChain } = useSwitchChain()

const net = computed(() => networkByChainId(chainId.value))
const themeStyle = computed(() => themeVars(tokens(dark.value), accent.value))

function onSwitch(id: number) {
  chainId.value = id
  try {
    switchChain({ chainId: id })
  }
  catch {
    /* wallet may not be connected yet — the selection still drives the read paths */
  }
}
</script>

<template>
  <div class="min-h-screen w-full bg-(--paper) font-sans text-(--ink)" :style="themeStyle">
    <div class="mx-auto min-h-screen max-w-[1280px] border-x border-(--line)">
      <header class="sticky top-0 z-10 overflow-visible border-b border-(--line) bg-(color-mix(in_srgb,var(--paper)_82%,transparent)) px-(--welcome-header-inset) py-3.5 backdrop-blur-md sm:px-10 sm:py-5">
        <div class="flex flex-col gap-3 overflow-visible sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div class="flex items-center justify-between gap-3">
            <div class="flex items-baseline gap-3">
              <span class="text-lg font-bold tracking-tight">
                create<span class="text-(--acc)">·</span>app
              </span>
              <span class="font-mono text-[11.5px] text-(--faint)">v1.0</span>
            </div>
            <div class="flex shrink-0 items-center gap-2 sm:hidden">
              <HeaderUtilities
                :accent="accent"
                :dark="dark"
                @accent-pick="accent = $event"
                @toggle-dark="dark = !dark"
              />
            </div>
          </div>

          <div class="flex flex-col gap-2 overflow-visible sm:flex-row sm:items-center sm:gap-3">
            <div class="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-2 overflow-visible">
              <NetworkSwitch :net="net" @switch="onSwitch($event)" />
              <WalletConnect :chain-id="net.chainId" />
            </div>
            <div class="hidden shrink-0 items-center gap-2 sm:flex">
              <HeaderUtilities
                :accent="accent"
                :dark="dark"
                @accent-pick="accent = $event"
                @toggle-dark="dark = !dark"
              />
            </div>
          </div>
        </div>
      </header>

      <section class="grid items-end gap-12 border-b border-(--line) px-10 pt-16 pb-11 welcome-md:grid-cols-1 welcome-sm:gap-6 welcome-sm:px-5 welcome-sm:py-9 lg:grid-cols-[1fr_320px]">
        <h1 class="m-0 max-w-[9ch] text-[84px] leading-[0.95] font-bold tracking-[-0.04em] welcome-md:text-[13vw]">
          {{ HEADLINE }}
        </h1>
        <p class="m-0 pb-2.5 text-[16.5px] leading-snug text-(--dim)">
          <span class="font-medium text-(--ink)">{{ CLI }}</span> {{ HERO_BLURB }}
        </p>
      </section>

      <LiveDemo :net="net" @switch="onSwitch($event)" />

      <div class="grid welcome-md:grid-cols-1 lg:grid-cols-[1fr_340px]">
        <div class="grid grid-cols-2 border-r border-(--line) welcome-md:border-r-0 welcome-sm:grid-cols-1">
          <div
            v-for="(f, i) in FEATURES"
            :key="f.title"
            class="p-6 px-7 transition-[background] duration-150 hover:bg-(color-mix(in_srgb,var(--acc)_5%,transparent))"
            :class="[
              i % 2 === 0 ? 'border-r border-(--line) welcome-sm:border-r-0' : '',
              i < FEATURES.length - 2 ? 'border-b border-(--line)' : '',
            ]"
          >
            <div class="flex items-baseline gap-2.5">
              <span class="font-mono text-xs font-semibold text-(--acc)">
                {{ String(i + 1).padStart(2, '0') }}
              </span>
              <span class="text-lg font-semibold tracking-tight">{{ f.title }}</span>
            </div>
            <p class="mt-2 mb-0 text-[13.5px] leading-snug text-(--dim)">{{ f.desc }}</p>
          </div>
        </div>

        <aside class="flex flex-col welcome-md:border-t welcome-md:border-(--line)">
          <div class="border-b border-(--line) bg-(color-mix(in_srgb,var(--acc)_10%,transparent)) p-6 px-7">
            <div class="font-mono text-[11px] font-semibold tracking-widest text-(--acc)">START HERE</div>
            <div class="mt-2 text-[17px] leading-snug font-semibold">
              Edit <span class="font-mono text-sm font-medium text-(--acc)">app/components/welcome/AppWelcome.vue</span> and save. It
              reloads instantly.
            </div>
          </div>
          <div class="flex flex-1 flex-col gap-0.5 p-5 px-7">
            <div class="mb-2 font-mono text-[11px] font-semibold tracking-widest text-(--faint)">RESOURCES</div>
            <a
              v-for="(r, i) in RESOURCES"
              :key="r.label"
              :href="r.href"
              target="_blank"
              rel="noreferrer"
              class="group flex items-center justify-between py-3 text-(--ink) no-underline transition-colors duration-150 hover:text-(--acc)"
              :class="i < RESOURCES.length - 1 ? 'border-b border-(--line)' : ''"
            >
              <span>
                <span class="block text-[15px] font-medium">{{ r.label }}</span>
                <span class="mt-px block font-mono text-[11px] text-(--faint)">{{ r.meta }}</span>
              </span>
              <IcArrow class="text-[17px] text-(--faint) transition-transform duration-150 group-hover:translate-x-[3px]" />
            </a>
          </div>
        </aside>
      </div>

      <footer class="flex flex-wrap items-center justify-between gap-3 border-t border-(--line) px-10 py-[18px] welcome-sm:px-5">
        <span class="font-mono text-[11.5px] text-(--faint)">
          generated by <span class="text-(--dim)">npm create dot-app@latest</span>
        </span>
        <span class="font-mono text-[11.5px] text-(--faint)">MIT · Polkadot-native</span>
      </footer>
    </div>
  </div>
</template>
