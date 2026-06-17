import { onScopeDispose, watch, type Ref } from 'vue'

/** Close on Escape and pointer-down outside `containerRef` while `open` is true. */
export function useDismissible(
  open: Ref<boolean>,
  onClose: () => void,
  containerRef: Ref<HTMLElement | null>,
) {
  let cleanup: (() => void) | null = null

  const teardown = () => {
    cleanup?.()
    cleanup = null
  }

  watch(open, (isOpen) => {
    teardown()
    if (!isOpen || typeof window === 'undefined') return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    const onDown = (e: MouseEvent) => {
      const el = containerRef.value
      if (el && !el.contains(e.target as Node)) onClose()
    }

    window.addEventListener('keydown', onKey)
    window.addEventListener('mousedown', onDown)
    cleanup = () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('mousedown', onDown)
    }
  })

  onScopeDispose(teardown)
}
