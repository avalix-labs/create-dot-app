<script setup lang="ts">
import { ref } from 'vue'
import { ACCENTS } from '~/lib/welcome/theme'
import { useDismissible } from '~/composables/useDismissible'
import PopoverPanel from './PopoverPanel.vue'

defineProps<{ accent: string }>()
const emit = defineEmits<{ pick: [color: string] }>()

const open = ref(false)
const wrapRef = ref<HTMLElement | null>(null)
useDismissible(open, () => (open.value = false), wrapRef)

const iconBtn
  = 'inline-flex size-[39px] shrink-0 cursor-pointer items-center justify-center border border-(--line) bg-transparent transition-[border-color,color] duration-150 hover:border-(--acc) hover:text-(--acc)'

function choose(color: string) {
  emit('pick', color)
  open.value = false
}
</script>

<template>
  <span ref="wrapRef" class="relative inline-flex">
    <button
      type="button"
      :class="iconBtn"
      title="Accent color"
      aria-label="Choose accent color"
      @click="open = !open"
    >
      <span class="inline-block size-4 rounded-full" :style="{ background: accent }" />
    </button>
    <PopoverPanel v-if="open" panel-class="right-0 z-30 flex gap-[9px] px-[13px] py-[11px] welcome-sm:right-0">
      <button
        v-for="c in ACCENTS"
        :key="c"
        type="button"
        :title="c"
        :aria-label="`Use accent ${c}`"
        class="size-6 shrink-0 cursor-pointer rounded-full border-0 p-0 transition-transform duration-150 hover:scale-110"
        :style="{
          background: c,
          boxShadow: c === accent ? '0 0 0 2px var(--card), 0 0 0 3.5px var(--ink)' : 'none',
        }"
        @click="choose(c)"
      />
    </PopoverPanel>
  </span>
</template>
