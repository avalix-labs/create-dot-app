<script setup lang="ts">
// Connect Wallet control. The button + connected-state dropdown are styled per
// the design; the actual connect/disconnect is driven by the real Web3Auth modal
// and the connected account's balance comes from wagmi.
import { computed, ref } from 'vue'
import { useWeb3AuthConnect, useWeb3AuthDisconnect, useWeb3AuthUser } from '@web3auth/modal/vue'
import { useBalance, useChains, useConnection } from '@wagmi/vue'
import { formatUnits } from 'viem'
import { formatAddress } from '~/lib/welcome/format'
import { useDismissible } from '~/composables/useDismissible'
import PopoverPanel from './PopoverPanel.vue'
import IcWallet from './icons/IcWallet.vue'

const props = defineProps<{ chainId: number }>()

const { connect, isConnected, loading: connecting } = useWeb3AuthConnect()
const { disconnect } = useWeb3AuthDisconnect()
const { userInfo } = useWeb3AuthUser()
const { address, connector } = useConnection()
const chains = useChains()
const chainReady = computed(() => chains.value.some((c) => c.id === props.chainId))

const { data: balance } = useBalance({
  address,
  chainId: computed(() => (chainReady.value ? props.chainId : undefined)),
  query: { enabled: computed(() => Boolean(address.value) && chainReady.value) },
})

const menu = ref(false)
const wrapRef = ref<HTMLElement | null>(null)
useDismissible(menu, () => (menu.value = false), wrapRef)

const connected = computed(() => isConnected.value && Boolean(address.value))
const label = computed(() => userInfo.value?.name || userInfo.value?.email || 'Account')
const shortAddress = computed(() => (address.value ? formatAddress(address.value) : ''))
const balanceText = computed(() => {
  const value = balance.value?.value
  if (value === undefined) return '—'
  return Number(formatUnits(value, balance.value!.decimals)).toLocaleString('en-US', {
    maximumFractionDigits: 4,
  })
})

function disconnectAll() {
  menu.value = false
  disconnect()
}
</script>

<template>
  <span ref="wrapRef" class="relative inline-flex">
    <button
      v-if="connected"
      type="button"
      class="inline-flex max-w-full min-w-0 cursor-pointer items-center gap-2 border-[1.5px] border-(--acc) bg-transparent px-3 py-2 font-mono text-xs font-medium text-(--ink) transition-[transform,background,color] duration-150 hover:-translate-y-px sm:max-w-none sm:px-4 sm:py-2.5 sm:text-[13px]"
      @click="menu = !menu"
    >
      <span class="inline-block size-2 shrink-0 rounded-full bg-(--acc) sm:size-2.25" />
      <span class="truncate">
        <span class="hidden sm:inline">{{ label }} · </span>
        {{ shortAddress }}
      </span>
    </button>
    <button
      v-else
      type="button"
      :disabled="connecting"
      class="inline-flex shrink-0 cursor-pointer items-center gap-2 border-[1.5px] border-(--ink) bg-transparent px-3 py-2 font-mono text-xs font-medium whitespace-nowrap text-(--ink) transition-[transform,background,color] duration-150 hover:-translate-y-px disabled:cursor-default disabled:opacity-70 sm:px-4 sm:py-2.5 sm:text-[13px]"
      @click="connect()"
    >
      <IcWallet class="text-[15px]" />
      <span class="sm:hidden">{{ connecting ? '…' : 'Connect' }}</span>
      <span class="hidden sm:inline">{{ connecting ? 'Connecting…' : 'Connect Wallet' }}</span>
    </button>

    <PopoverPanel v-if="connected && menu" panel-class="right-0 z-30 w-72 welcome-sm:right-0">
      <div class="border-b border-(--line) px-[18px] py-4">
        <div class="flex items-center gap-2.5">
          <span class="inline-flex size-[30px] shrink-0 items-center justify-center rounded-full bg-(--acc) font-mono text-[13px] font-semibold text-white">
            {{ label[0]?.toUpperCase() }}
          </span>
          <div class="min-w-0">
            <div class="text-[15px] font-semibold text-(--ink)">{{ label }}</div>
            <div class="font-mono text-[11px] text-(--faint)">via {{ connector?.name ?? 'Web3Auth' }}</div>
          </div>
        </div>
        <div class="mt-3.25 flex items-baseline justify-between">
          <span class="font-mono text-[10.5px] tracking-widest text-(--faint)">BALANCE</span>
          <span class="font-mono text-[15px] tabular-nums text-(--ink)">
            {{ balanceText }} <span class="text-xs text-(--dim)">{{ balance?.symbol ?? '' }}</span>
          </span>
        </div>
        <div class="mt-1 break-all font-mono text-[11px] text-(--dim)">{{ shortAddress }}</div>
      </div>
      <button
        type="button"
        class="block w-full cursor-pointer border-0 bg-transparent px-[18px] py-3 text-left text-[13.5px] text-(--acc) transition-[background] duration-150 hover:bg-(color-mix(in_srgb,var(--acc)_8%,transparent))"
        @click="disconnectAll"
      >
        Disconnect
      </button>
    </PopoverPanel>
  </span>
</template>
