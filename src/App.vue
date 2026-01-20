<script setup lang="ts">
import BreakdownSection from '@/components/sections/breakdown/BreakdownSection.vue'
import DeckGrid from '@/components/sections/deck/DeckGrid.vue'
import JokersSection from '@/components/sections/jokers/JokersSection.vue'
import useIsHandFlush from '@/composables/hands/useIsHandFlush'
import useIsHandSameRankHands from '@/composables/hands/useIsHandSameRankHands'
import useIsHandStraight from '@/composables/hands/useIsHandStraight'
import useJokerState from '@/composables/useJokerState'
import { PokerHandType, type PlayingHand, type PlayingHandCard } from '@/types'
import { useDark, useUrlSearchParams } from '@vueuse/core'
import { computed, onMounted, ref, watch } from 'vue'
import HandSection from './components/hand/HandSection.vue'

const isDark = useDark({
  // BY DEFAULT, isDark disables transitions to avoid a flash of unstyled content
  disableTransition: false,
})
const playingHand = ref<PlayingHand>([])

const { isUsingFourFingers, isUsingShortcut, isUsingSmearedJoker } = useJokerState()

const { isHandStraight, qualifyingStraightHand, rankSortedHand } = useIsHandStraight(playingHand)

const { isHandFlush, suitSortedHand } = useIsHandFlush(playingHand)

const { pokerHand } = useIsHandSameRankHands(rankSortedHand)

const handType = computed(() => {
  const handType = pokerHand.value

  if (isHandFlush.value) {
    // special case: Flush House
    if (handType === PokerHandType.FullHouse) {
      return PokerHandType.FlushHouse
    }

    // special case: Flush Five
    if (handType === PokerHandType.FiveOfAKind) {
      return PokerHandType.FlushFive
    }

    // special case: Straight Flush
    if (isHandStraight.value) {
      return PokerHandType.StraightFlush
    }

    return PokerHandType.Flush
  }

  if (isHandStraight.value) {
    return PokerHandType.Straight
  }

  return handType
})

const params = useUrlSearchParams('hash')
watch(isUsingFourFingers, (newVal) => {
  params['four-fingers'] = newVal ? '1' : '0'
})
watch(isUsingShortcut, (newVal) => {
  params['shortcut'] = newVal ? '1' : '0'
})
watch(isUsingSmearedJoker, (newVal) => {
  params['smeared-joker'] = newVal ? '1' : '0'
})
watch(playingHand, (newHand) => {
  const handParam = newHand
    .map(
      ([suit, rank, isWildcardEnabled, isDebuffed]) =>
        `${suit}-${rank}-${isWildcardEnabled ? 1 : 0}-${isDebuffed ? 1 : 0}`,
    )
    .join(',')
  params['hand'] = handParam
})

onMounted(() => {
  const handParam = params['hand'] as string | undefined
  if (handParam) {
    const cards = handParam.split(',').map((pair) => {
      const [suitStr, rankStr, isWildcardEnabledStr, isDebuffedStr] = pair.split('-')
      return [
        Number(suitStr),
        Number(rankStr),
        isWildcardEnabledStr === '1',
        isDebuffedStr === '1',
      ] as [number, number, boolean, boolean]
    })

    playingHand.value = cards.map(
      ([suit, rank, isWildcardEnabled, isDebuffed]) =>
        [suit, rank, isWildcardEnabled, isDebuffed] as PlayingHandCard,
    )
  } else {
    playingHand.value = []
  }

  isUsingFourFingers.value = params['four-fingers'] === '1'
  isUsingShortcut.value = params['shortcut'] === '1'
  isUsingSmearedJoker.value = params['smeared-joker'] === '1'
})
</script>

<template>
  <div class="fixed right-2 bottom-2 z-10 p-2">
    <button
      class="relative block h-7 w-12 cursor-pointer rounded-full border-2 border-gray-300 bg-amber-300 text-red-950 transition-all duration-1000 hover:border-gray-300"
      :class="{
        'bg-indigo-600 text-white': isDark,
      }"
      @click="isDark = !isDark"
    >
      <span
        class="absolute top-0 left-0 block h-6 w-6 overflow-hidden rounded-full bg-gray-100 text-center text-[.75rem] leading-6 transition-all group-hover:bg-white"
        :class="{
          'translate-x-5': isDark,
          'translate-x-0': !isDark,
        }"
      >
        <span class="relative block h-4 w-4">
          <Transition
            enter-from-class="opacity-0"
            enter-active-class="transition-opacity"
            enter-to-class="opacity-100"
            leave-from-class="opacity-100"
            leave-active-class="transition-opacity"
            leave-to-class="opacity-0"
            mode="out-in"
          >
            <span v-if="isDark" class="absolute top-0 left-1 inline-block h-3 w-3">🌙</span>
            <span v-else class="absolute top-0 left-1 inline-block h-3 w-3">☀️</span>
          </Transition>
        </span>
      </span>
    </button>
  </div>
  <div class="mx-auto my-8 px-8 md:max-w-4/5 lg:max-w-3/5 lg:px-0">
    <JokersSection class="mt-8" :playing-hand="playingHand" />

    <HandSection v-model="playingHand" :hand-type="handType" />

    <BreakdownSection
      v-if="handType !== PokerHandType.EmptyHand && handType !== PokerHandType.HighCard"
      class="mt-4 text-center"
      :hand-type="handType"
      :is-hand-straight="isHandStraight"
      :is-hand-flush="isHandFlush"
      :qualifying-straight-hand="qualifyingStraightHand"
      :suit-sorted-hand="suitSortedHand"
    />

    <section class="mt-8">
      <h2 class="text-center text-xl font-bold">Deck</h2>
      <DeckGrid v-model="playingHand" class="mt-4" />
    </section>
  </div>
</template>
