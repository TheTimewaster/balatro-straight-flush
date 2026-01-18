<script setup lang="ts">
import BreakdownSection from '@/components/sections/breakdown/BreakdownSection.vue'
import DeckGrid from '@/components/sections/deck/DeckGrid.vue'
import JokersSection from '@/components/sections/jokers/JokersSection.vue'
import useIsHandFlush from '@/composables/hands/useIsHandFlush'
import useIsHandSameRankHands from '@/composables/hands/useIsHandSameRankHands'
import useIsHandStraight from '@/composables/hands/useIsHandStraight'
import useJokerState from '@/composables/useJokerState'
import { PokerHandType, type PlayingHand } from '@/types'
import { useDark, useUrlSearchParams } from '@vueuse/core'
import { computed, onMounted, ref, watch } from 'vue'
import HandSection from './components/hand/HandSection.vue'

const isDark = useDark()
const playingHand = ref<PlayingHand>([])

const { isUsingFourFingers, isUsingShortcut, isUsingSmearedJoker } = useJokerState()

const isQualifyingForEvaluation = computed((): boolean => {
  if (isUsingFourFingers.value) {
    return playingHand.value.length >= 4
  }

  return playingHand.value.length >= 5
})

const { isHandStraight, qualifyingStraightHand, rankSortedHand } = useIsHandStraight(
  playingHand,
  isQualifyingForEvaluation,
  isUsingFourFingers,
  isUsingShortcut,
)

const { isHandFlush, suitSortedHand } = useIsHandFlush(
  playingHand,
  isQualifyingForEvaluation,
  isUsingSmearedJoker,
  isUsingFourFingers,
)

const { pokerHand } = useIsHandSameRankHands(rankSortedHand)

const handType = computed(() => {
  const handType = pokerHand.value

  if (handType !== PokerHandType.HighCard) {
    if (isHandFlush.value) {
      // special case: Flush House
      if (handType === PokerHandType.FullHouse) {
        return PokerHandType.FlushHouse
      }

      // special case: Flush Five
      if (handType === PokerHandType.FiveOfAKind) {
        return PokerHandType.FlushFive
      }
    }

    return handType
  }

  if (isHandFlush.value && isHandStraight.value) {
    return PokerHandType.StraightFlush
  }

  if (isHandFlush.value) {
    return PokerHandType.Flush
  }

  if (isHandStraight.value) {
    return PokerHandType.Straight
  }

  return PokerHandType.HighCard
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
  const handParam = newHand.map(([suit, rank]) => `${suit}-${rank}`).join(',')
  params['hand'] = handParam
})

onMounted(() => {
  const handParam = params['hand'] as string | undefined
  if (handParam) {
    const cards = handParam.split(',').map((pair) => {
      const [suitStr, rankStr] = pair.split('-')
      return [Number(suitStr), Number(rankStr)] as [number, number]
    })

    playingHand.value = cards
  } else {
    playingHand.value = []
  }

  isUsingFourFingers.value = params['four-fingers'] === '1'
  isUsingShortcut.value = params['shortcut'] === '1'
  isUsingSmearedJoker.value = params['smeared-joker'] === '1'
})
</script>

<template>
  <button
    class="fixed right-2 bottom-2 flex h-12 w-12 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-gray-300 text-center transition-colors hover:bg-gray-400"
    @click="isDark = !isDark"
  >
    <Transition
      enter-active-class="absolute transition-all"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="absolute transition-all"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
      mode="out-in"
    >
      <span v-if="isDark" class="inline-block text-2xl">🌙</span>
      <span v-else class="mt-1 inline-block text-2xl">☀️</span>
    </Transition>
  </button>
  <div class="mx-auto my-8 max-w-3/5">
    <JokersSection class="mt-8" :playing-hand="playingHand" />

    <HandSection :hand-type="handType" v-model="playingHand" />

    <BreakdownSection
      v-if="handType !== PokerHandType.HighCard"
      class="mt-4 text-center"
      :hand-type="handType"
      :is-hand-straight="isHandStraight"
      :is-hand-flush="isHandFlush"
      :qualifying-straight-hand="qualifyingStraightHand"
      :suit-sorted-hand="suitSortedHand"
    />

    <section class="mt-8">
      <h2 class="text-center text-xl font-bold">Deck</h2>
      <DeckGrid class="mt-4" v-model="playingHand" />
    </section>
  </div>
</template>

<style scoped></style>
