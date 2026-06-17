<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useBlockNumber, useChains, useConfig } from '@wagmi/vue'
import { getBlock } from '@wagmi/vue/actions'
import type { NetworkInfo } from '~/lib/welcome/networks'
import { EYEBROW, LIVE_CELL } from '~/lib/welcome/shared'
import LiveDot from './icons/LiveDot.vue'

const props = defineProps<{ net: NetworkInfo }>()

const chains = useChains()
const config = useConfig()
const chainReady = computed(() => chains.value.some((c) => c.id === props.net.chainId))

const { data: blockNumber } = useBlockNumber({
  chainId: computed(() => (chainReady.value ? props.net.chainId : undefined)),
  watch: chainReady,
  query: { enabled: chainReady },
})

// @wagmi/vue has no `useBlock`, so fetch the head block's hash whenever the
// watched block number advances.
const hash = ref<string | null>(null)
watch(
  [blockNumber, chainReady],
  async ([number, ready]) => {
    if (!ready || number === undefined) {
      hash.value = null
      return
    }
    try {
      const head = await getBlock(config, { chainId: props.net.chainId, blockNumber: number })
      hash.value = head.hash
    }
    catch {
      /* transient RPC error — keep the previous hash */
    }
  },
  { immediate: true },
)

const block = computed(() => blockNumber.value ?? null)
const reconnecting = computed(() => !chainReady.value || block.value === null)
const finalized = computed(() => (block.value !== null ? block.value - 3n : null))
const blockDigits = computed(() =>
  block.value === null ? [] : Number(block.value).toLocaleString('en-US').split(''),
)

const stats = computed<[string, string][]>(() => [
  ['Finalized', finalized.value !== null ? `#${Number(finalized.value).toLocaleString('en-US')}` : '—'],
  ['Chain', props.net.chain],
  ['Token', props.net.token],
])
</script>

<template>
  <div class="border-r border-(--line) welcome-md:border-r-0 welcome-md:border-b" :class="LIVE_CELL">
    <div class="flex items-center justify-between">
      <span :class="EYEBROW">NETWORK</span>
      <span
        class="inline-flex items-center gap-2 font-mono text-[11.5px]"
        :class="reconnecting ? 'text-(--faint)' : 'text-(--dim)'"
      >
        <LiveDot :color="reconnecting ? 'var(--faint)' : net.color" />
        {{ reconnecting ? 'connecting…' : 'connected' }}
      </span>
    </div>

    <div class="mt-[18px] flex items-baseline gap-2.5">
      <span class="font-mono text-[15px] font-semibold text-(--acc)">#</span>
      <span class="inline-block font-mono text-[clamp(36px,5.2vw,52px)] leading-none font-semibold tracking-tight text-(--ink) tabular-nums welcome-sm:text-[clamp(34px,11vw,52px)]">
        <template v-if="block !== null">
          <span
            v-for="(ch, i) in blockDigits"
            :key="`${i}-${ch}`"
            class="inline-block animate-block-bump"
          >{{ ch }}</span>
        </template>
        <template v-else>—</template>
      </span>
    </div>
    <div class="mt-2 font-mono text-xs text-(--faint)">
      {{ hash ? `${hash.slice(0, 10)}…` : '0x…' }} · ~3s block time
    </div>

    <div class="mt-5 flex flex-wrap gap-x-7 gap-y-3.5">
      <div v-for="[k, v] in stats" :key="k">
        <div class="font-mono text-[10.5px] tracking-widest text-(--faint)">{{ k.toUpperCase() }}</div>
        <div class="mt-1 font-mono text-sm text-(--ink)">{{ v }}</div>
      </div>
    </div>
  </div>
</template>
