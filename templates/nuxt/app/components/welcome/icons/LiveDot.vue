<script setup lang="ts">
// A small animated "live" status dot used by the network indicator.
import { computed } from 'vue'

const props = withDefaults(defineProps<{ color: string, size?: 'sm' | 'md' }>(), {
  size: 'sm',
})

const sizeClass = computed(() => (props.size === 'md' ? 'size-2.25' : 'size-2'))
</script>

<template>
  <span class="relative inline-flex shrink-0" :class="sizeClass">
    <span class="absolute inset-0 animate-dapp-ping rounded-full opacity-45" :style="{ background: color }" />
    <span class="absolute inset-0 rounded-full" :style="{ background: color }" />
  </span>
</template>
