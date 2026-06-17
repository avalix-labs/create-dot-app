<script setup lang="ts">
const shell
  = 'absolute top-[calc(100%+8px)] z-40 animate-popover-rise border border-(--line) bg-(--card) shadow-(0_18px_50px_rgba(0,0,0,.18))'

const mobileDefault
  = 'welcome-sm:left-0 welcome-sm:right-auto welcome-sm:w-[calc(100vw-2*var(--welcome-header-inset))] welcome-sm:max-w-none'

withDefaults(
  defineProps<{
    /** e.g. w-72 for wallet menu, sm:w-[308px] for network list */
    panelClass?: string
    /** Mobile panel width; defaults to viewport minus header padding */
    mobileClass?: string
  }>(),
  { panelClass: '', mobileClass: mobileDefault },
)
</script>

<template>
  <div :class="[shell, mobileClass, panelClass]">
    <slot />
  </div>
</template>
