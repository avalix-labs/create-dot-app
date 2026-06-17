<script setup lang="ts">
import type { NetworkInfo } from '~/lib/welcome/networks'
import BlockPanel from './BlockPanel.vue'
import WritePanel from './WritePanel.vue'

defineProps<{ net: NetworkInfo }>()
const emit = defineEmits<{ switch: [chainId: number] }>()
</script>

<template>
  <div class="grid grid-cols-2 border-b border-(--line) welcome-md:grid-cols-1">
    <BlockPanel :net="net" />
    <WritePanel :net="net" @switch="emit('switch', $event)" />
  </div>
</template>
