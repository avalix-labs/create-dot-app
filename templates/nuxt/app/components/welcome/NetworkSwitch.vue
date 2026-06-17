<script setup lang="ts">
// Top-bar network selector. Click to open a dropdown of the available chains;
// selecting one commits immediately via the parent-owned chain id.
import { ref } from 'vue'
import { NETWORKS, type NetworkInfo, rpcHost } from '~/lib/welcome/networks'
import { useDismissible } from '~/composables/useDismissible'
import PopoverPanel from './PopoverPanel.vue'
import LiveDot from './icons/LiveDot.vue'
import IcCheck from './icons/IcCheck.vue'

const props = defineProps<{ net: NetworkInfo }>()
const emit = defineEmits<{ switch: [chainId: number] }>()

const open = ref(false)
const wrapRef = ref<HTMLElement | null>(null)
useDismissible(open, () => (open.value = false), wrapRef)

function choose(n: NetworkInfo) {
  if (n.chainId === props.net.chainId) {
    open.value = false
    return
  }
  emit('switch', n.chainId)
  open.value = false
}
</script>

<template>
  <span ref="wrapRef" class="relative inline-flex min-w-0 overflow-visible welcome-sm:w-full">
    <button
      type="button"
      aria-label="Switch network"
      class="inline-flex min-w-0 cursor-pointer items-center gap-2 border border-(--line) bg-transparent px-3 py-2 font-mono text-[12.5px] font-medium text-(--ink) transition-[border-color,background] duration-150 hover:border-(--acc) welcome-sm:w-full sm:gap-2.25 sm:py-2.25"
      @click="open = !open"
    >
      <LiveDot :color="net.color" size="md" />
      <span class="min-w-0 truncate sm:whitespace-nowrap">
        <span class="sm:hidden">{{ net.chain }}</span>
        <span class="hidden sm:inline">{{ net.name }}</span>
      </span>
      <svg
        viewBox="0 0 24 24"
        width="13"
        height="13"
        fill="none"
        class="shrink-0 transition-transform duration-150"
        :class="open ? 'rotate-180' : ''"
      >
        <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>

    <PopoverPanel v-if="open" panel-class="sm:left-auto sm:right-0 sm:w-[308px] sm:max-w-[308px]">
      <div class="border-b border-(--line) px-[18px] pt-[13px] pb-[11px]">
        <div class="font-mono text-[10.5px] font-semibold tracking-[0.12em] text-(--faint)">
          SWITCH NETWORK
        </div>
      </div>
      <button
        v-for="(n, i) in NETWORKS"
        :key="n.id"
        type="button"
        class="flex w-full cursor-pointer items-center gap-3 px-[18px] py-[13px] text-left transition-[background] duration-150 hover:bg-(color-mix(in_srgb,var(--acc)_8%,transparent))"
        :class="[
          n.chainId === net.chainId ? 'bg-(color-mix(in_srgb,var(--acc)_6%,transparent))' : 'bg-transparent',
          i < NETWORKS.length - 1 ? 'border-b border-(--line)' : '',
        ]"
        @click="choose(n)"
      >
        <span class="size-2.5 shrink-0 rounded-full" :style="{ background: n.color }" />
        <span class="min-w-0 flex-1">
          <span class="flex items-center gap-2">
            <span class="text-[14.5px] font-semibold text-(--ink)">{{ n.name }}</span>
            <span
              class="rounded-[3px] border px-[5px] py-px font-mono text-[9px] font-semibold tracking-[0.08em]"
              :style="{ color: n.color, borderColor: `color-mix(in srgb, ${n.color} 45%, transparent)` }"
            >
              {{ n.tag }}
            </span>
          </span>
          <span class="mt-[3px] block truncate font-mono text-[11px] text-(--faint)">
            {{ rpcHost(n.rpc) }}
          </span>
        </span>
        <span class="inline-flex w-[18px] shrink-0 items-center justify-center">
          <IcCheck v-if="n.chainId === net.chainId" class="text-base text-(--acc)" />
        </span>
      </button>
    </PopoverPanel>
  </span>
</template>
