<script setup lang="ts">
defineProps<{ dark: boolean }>()
const emit = defineEmits<{ toggle: [] }>()

const iconBtn
  = 'inline-flex size-[39px] shrink-0 cursor-pointer items-center justify-center border border-(--line) bg-transparent transition-[border-color,color] duration-150 hover:border-(--acc) hover:text-(--acc)'
</script>

<template>
  <button
    type="button"
    :class="[iconBtn, 'text-(--ink)']"
    title="Toggle light / dark"
    aria-label="Toggle light or dark mode"
    @click="emit('toggle')"
  >
    <span class="relative inline-block size-4 overflow-hidden rounded-full border-[1.5px] border-current">
      <span
        class="absolute top-0 bottom-0 w-1/2 bg-current transition-[left,right] duration-200"
        :class="dark ? 'right-0 left-auto' : 'left-0 right-auto'"
      />
    </span>
  </button>
</template>
