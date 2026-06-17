<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  useChains,
  useConfig,
  useConnection,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from '@wagmi/vue'
import { waitForTransactionReceipt } from '@wagmi/vue/actions'
import { useWeb3AuthConnect } from '@web3auth/modal/vue'
import type { Abi, BaseError } from 'viem'
import { TESTNET, explorerTxUrl, type NetworkInfo } from '~/lib/welcome/networks'
import { formatAddress } from '~/lib/welcome/format'
import { flipperAbi, flipperAddressForChain, remarkAbi, remarkAddressForChain } from '~/lib/contracts'
import {
  EYEBROW,
  LIVE_CELL,
  REMARK_MESSAGE,
  WRITE_ACTIONS,
  WRITE_STEPS,
  type WriteActionKey,
} from '~/lib/welcome/shared'
import IcArrow from './icons/IcArrow.vue'
import IcCheck from './icons/IcCheck.vue'

const props = defineProps<{ net: NetworkInfo }>()
const emit = defineEmits<{ switch: [chainId: number] }>()

const config = useConfig()
const chains = useChains()
const chainReady = computed(() => chains.value.some((c) => c.id === props.net.chainId))
const { isConnected, connect } = useWeb3AuthConnect()
const { address } = useConnection()

const flipperAddress = computed(() => flipperAddressForChain(props.net.chainId))
const remarkAddress = computed(() => remarkAddressForChain(props.net.chainId))

const { data: flipValue, refetch: refetchFlip } = useReadContract({
  address: flipperAddress,
  abi: flipperAbi as Abi,
  functionName: 'get',
  chainId: computed(() => props.net.chainId),
  query: { enabled: computed(() => Boolean(flipperAddress.value) && chainReady.value) },
})

const { mutate, data: txHash, error: txError, isPending, reset } = useWriteContract()
const { isLoading: isConfirming, isSuccess: isConfirmed, data: receipt } = useWaitForTransactionReceipt({
  hash: txHash,
})

const actionKey = ref<WriteActionKey>('remark')
const action = computed(() => WRITE_ACTIONS[actionKey.value])
const actions = Object.values(WRITE_ACTIONS)

const contractAddress = computed(() => (actionKey.value === 'flip' ? flipperAddress.value : remarkAddress.value))
const actionBlocked = computed(() => !contractAddress.value)
const actionLabel = computed(() => (actionKey.value === 'flip' ? 'flipper.flip' : 'system.remark'))
const isTestnet = computed(() => props.net.chainId === TESTNET.chainId)
const missingContractName = computed(() => (actionKey.value === 'flip' ? 'flipper' : 'remark'))

watch(() => props.net.chainId, () => reset())

const stage = computed(() => (isConfirmed.value ? 3 : txHash.value ? 2 : isPending.value ? 1 : -1))
const pending = computed(
  () => isPending.value || (Boolean(txHash.value) && isConfirming.value && !isConfirmed.value),
)

const flipValueText = computed(() => (flipValue.value === undefined ? '…' : String(flipValue.value)))
const signerLabel = computed(() =>
  isConnected.value && address.value ? formatAddress(address.value, 8, 4) : 'not connected',
)
const errorText = computed(() => {
  const error = txError.value as unknown as BaseError | null
  return error ? error.shortMessage || error.message : ''
})
const txHashShort = computed(() => (txHash.value ? formatAddress(txHash.value, 8, 4) : ''))
const txExplorerUrl = computed(() => (txHash.value ? explorerTxUrl(props.net, txHash.value) : undefined))
const receiptBlock = computed(() =>
  receipt.value ? Number(receipt.value.blockNumber).toLocaleString('en-US') : '',
)

function pickAction(key: WriteActionKey) {
  if (pending.value) return
  actionKey.value = key
  reset()
}

function submit() {
  if (pending.value || actionBlocked.value) return
  if (!isConnected.value || !address.value) {
    connect()
    return
  }
  reset()

  if (actionKey.value === 'flip' && flipperAddress.value) {
    mutate(
      {
        address: flipperAddress.value,
        abi: flipperAbi as Abi,
        functionName: 'flip',
        chainId: props.net.chainId,
      },
      {
        onSuccess: async (hash) => {
          await waitForTransactionReceipt(config, { hash, chainId: props.net.chainId })
          void refetchFlip()
        },
      },
    )
    return
  }

  if (actionKey.value === 'remark' && remarkAddress.value) {
    mutate({
      address: remarkAddress.value,
      abi: remarkAbi as Abi,
      functionName: 'remark',
      args: [REMARK_MESSAGE],
      chainId: props.net.chainId,
    })
  }
}
</script>

<template>
  <div :class="LIVE_CELL">
    <div class="flex items-center justify-between">
      <span :class="EYEBROW">TRY THE WRITE PATH</span>
      <span class="font-mono text-[11.5px] text-(--faint)">signer: {{ signerLabel }}</span>
    </div>

    <div class="mt-3.5 inline-flex gap-0.5 self-start border border-(--line) p-0.5">
      <button
        v-for="a in actions"
        :key="a.key"
        type="button"
        class="cursor-pointer border-0 px-3 py-1.5 font-mono text-[11.5px] font-semibold transition-[background,color] duration-150"
        :class="[
          pending && a.key !== actionKey ? 'cursor-default opacity-50' : '',
          a.key === actionKey ? 'bg-(--acc) text-(--paper)' : 'bg-transparent text-(--dim)',
        ]"
        @click="pickAction(a.key)"
      >
        {{ a.tab }}{{ a.key === 'flip' ? '()' : '' }}
      </button>
    </div>

    <div class="min-h-[130px]">
      <div v-if="actionBlocked" class="mt-3 border border-dashed border-(--line) px-4 py-3.5">
        <div class="flex items-center gap-2.25">
          <span class="size-1.75 shrink-0 rounded-full bg-(--faint)" />
          <div class="text-[17px] font-semibold tracking-tight text-(--ink)">
            No {{ missingContractName }} contract on {{ net.chain }}
          </div>
        </div>
        <p class="mt-1.5 mb-0 text-[13px] leading-normal text-(--dim)">
          Run <span class="font-mono text-xs text-(--acc)">npm run deploy:contracts</span> then set
          <span class="font-mono text-xs text-(--acc)">{{ missingContractName }}</span> in
          <span class="font-mono text-xs text-(--acc)">app/lib/contracts/addresses.ts</span> (testnet).
        </p>
        <button
          v-if="!isTestnet"
          type="button"
          class="group mt-2.5 inline-flex cursor-pointer items-center gap-1.5 border-0 bg-transparent p-0 font-mono text-[12.5px] font-semibold whitespace-nowrap text-(--acc)"
          @click="emit('switch', TESTNET.chainId)"
        >
          Switch to {{ TESTNET.chain }}
          <IcArrow class="text-sm transition-transform duration-150 group-hover:translate-x-[3px]" />
        </button>
      </div>

      <template v-else>
        <div class="mt-3.5 flex items-start justify-between gap-5 welcome-sm:flex-col welcome-sm:items-stretch welcome-sm:gap-3.5">
          <div class="min-w-0">
            <div class="text-xl font-semibold tracking-tight text-(--ink)">{{ action.title }}</div>
            <div class="mt-1.5 font-mono text-[12.5px] text-(--dim)">
              <template v-if="actionKey === 'flip'">
                flipper.flip() · value: <span class="text-(--acc)">{{ flipValueText }}</span>
              </template>
              <template v-else>
                system.remark(<span class="text-(--acc)">&quot;{{ REMARK_MESSAGE }}&quot;</span>)
              </template>
            </div>
          </div>
          <button
            type="button"
            :disabled="pending"
            class="inline-flex min-w-[172px] shrink-0 items-center justify-center gap-2 border-[1.5px] border-(--acc) px-[18px] py-[11px] font-mono text-[13px] font-semibold whitespace-nowrap transition-[transform,background,color] duration-150 welcome-sm:w-full"
            :class="
              pending
                ? 'cursor-default bg-transparent text-(--acc) opacity-70'
                : 'cursor-pointer bg-(--acc) text-(--paper) hover:-translate-y-px'
            "
            @click="submit"
          >
            {{ pending ? 'Submitting…' : stage === 3 ? 'Run again' : !isConnected ? 'Connect to send' : action.cta }}
            <IcArrow v-if="!pending" class="text-[15px]" />
          </button>
        </div>

        <div class="mt-[18px] flex items-center">
          <template v-for="(labelText, i) in WRITE_STEPS" :key="labelText">
            <div class="flex items-center gap-1.75">
              <span
                class="inline-block size-[11px] shrink-0 rounded-full border-[1.5px] transition-all duration-200"
                :class="[
                  stage >= i ? 'border-(--acc) bg-(--acc)' : 'border-(--line) bg-transparent',
                  stage >= i && i === stage && pending
                    ? 'shadow-(0_0_0_4px_color-mix(in_srgb,var(--acc)_22%,transparent))'
                    : '',
                ]"
              />
              <span
                class="font-mono text-[11.5px] transition-colors duration-200"
                :class="stage >= i ? 'text-(--ink)' : 'text-(--faint)'"
              >{{ labelText }}</span>
            </div>
            <div
              v-if="i < WRITE_STEPS.length - 1"
              class="mx-2.25 h-[1.5px] flex-1 transition-[background] duration-200"
              :class="stage > i ? 'bg-(--acc)' : 'bg-(--line)'"
            />
          </template>
        </div>

        <div class="mt-3.5 flex min-h-[22px] flex-col gap-1.5">
          <div v-if="errorText" class="font-mono text-xs text-(--acc)">{{ errorText }}</div>
          <div v-else-if="isConfirmed && txHash" class="flex items-center gap-2.5 font-mono text-xs">
            <span class="inline-flex items-center gap-1.25 font-semibold text-(--acc)">
              <IcCheck class="text-[13px]" /> Finalized
            </span>
            <span class="text-(--faint)">{{ actionLabel }}</span>
            <a
              :href="txExplorerUrl"
              target="_blank"
              rel="noreferrer"
              title="View transaction on the block explorer"
              class="text-(--dim) no-underline transition-colors duration-150 hover:text-(--acc)"
            >
              {{ txHashShort }}
            </a>
            <span v-if="receipt" class="ml-auto text-(--faint)">in #{{ receiptBlock }}</span>
          </div>
          <div v-else class="font-mono text-xs text-(--faint)">No extrinsics submitted yet.</div>
        </div>
      </template>
    </div>
  </div>
</template>
