import { inject, provide, ref, type InjectionKey, type Ref } from 'vue'

interface WagmiRemount {
  /** Bump this to force-remount `<WagmiProvider>` and rebuild its wagmi config. */
  wagmiKey: Ref<number>
  remountWagmi: () => void
}

const WAGMI_REMOUNT_KEY: InjectionKey<WagmiRemount> = Symbol('wagmi-remount')

/** Set up the remount context. Call once in the provider shell. */
export function provideWagmiRemount(): WagmiRemount {
  const wagmiKey = ref(0)
  const remountWagmi = () => {
    wagmiKey.value += 1
  }
  const value = { wagmiKey, remountWagmi }
  provide(WAGMI_REMOUNT_KEY, value)
  return value
}

export function useWagmiRemount(): WagmiRemount {
  const value = inject(WAGMI_REMOUNT_KEY)
  if (!value) {
    throw new Error('useWagmiRemount must be used within the Web3 provider shell')
  }
  return value
}
