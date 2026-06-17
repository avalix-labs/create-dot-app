<script setup lang="ts">
import AccentPicker from './AccentPicker.vue'
import ThemeToggle from './ThemeToggle.vue'

defineProps<{ accent: string, dark: boolean }>()
const emit = defineEmits<{ accentPick: [color: string], toggleDark: [] }>()
</script>

<template>
  <AccentPicker :accent="accent" @pick="emit('accentPick', $event)" />
  <ThemeToggle :dark="dark" @toggle="emit('toggleDark')" />
</template>
