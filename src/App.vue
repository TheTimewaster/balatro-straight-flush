<script setup lang="ts">
import getRankLabel from '@/utils/getRankLabel'
import getSuitColor from '@/utils/getSuitColor'
import getSuitSymbol from '@/utils/getSuitSymbol'
import { computed, ref } from 'vue'
import CardGrid from './components/CardGrid.vue'
import useJokerState from './components/composables/useJokerState'
import PlayingHandRow from './components/hand/HandRow.vue'
import { CardSuit, type PlayingHand } from './types'
import useIsHandStraight from './components/composables/hands/useIsHandStraight'

const playingHand = ref<PlayingHand>([])

const { isUsingFourFingers, isUsingShortcut, isUsingSmearedJoker } = useJokerState(playingHand)

const isQualifyingForEvaluation = computed((): boolean => {
  if (isUsingFourFingers.value) {
    return playingHand.value.length >= 4
  } else {
    return playingHand.value.length >= 5
  }
})

const { isHandStraight, qualifyingStraightHand: qualifyingHand } = useIsHandStraight(
  playingHand,
  isQualifyingForEvaluation,
  isUsingFourFingers,
  isUsingShortcut,
)

const suitSortedHand = computed((): PlayingHand => {
  return [...playingHand.value].sort((a, b) => a[0] - b[0])
})
const isHandFlush = computed(() => {
  if (!isQualifyingForEvaluation.value) {
    return false
  }

  const suitCardCount = new Map<CardSuit, number>()

  playingHand.value.forEach(([suit]) => {
    const currentCount = suitCardCount.get(suit) ?? 0
    suitCardCount.set(suit, currentCount + 1)
  })

  if (isUsingSmearedJoker.value) {
    const colorCount = Array(2).fill(0) // [black suits, red suits]
    for (const [suit, count] of suitCardCount) {
      if (suit === CardSuit.Spade || suit === CardSuit.Club) {
        colorCount[0] += count

        if (colorCount[0] >= 5 || (isUsingFourFingers.value && colorCount[0] >= 4)) {
          return true
        }
      } else {
        colorCount[1] += count

        if (colorCount[1] >= 5 || (isUsingFourFingers.value && colorCount[1] >= 4)) {
          return true
        }
      }
    }
  }

  for (const [, count] of suitCardCount) {
    if (count >= 5 || (isUsingFourFingers.value && count >= 4)) {
      return true
    }
  }

  return false
})

const handType = computed(() => {
  if (isHandFlush.value && isHandStraight.value) {
    return 'a straight flush'
  }

  if (isHandFlush.value) {
    return 'a flush'
  }

  if (isHandStraight.value) {
    return 'a straight'
  }

  return 'invalid'
})
</script>

<template>
  <main class="max-w-4/5 mx-auto">
    <h1 class="text-center text-2xl font-bold">Balatro - Straight/Flush</h1>
    <p class="text-center">Is your playing hand a Straight, Flush even both?</p>

    <section>
      <h2 class="text-center mt-8 text-xl font-bold">Your Jokers</h2>
      <div class="mt-4 flex gap-4 justify-center">
        <input type="checkbox" id="Four Fingers" v-model="isUsingFourFingers" />
        <label for="Four Fingers">Four Fingers</label>

        <input type="checkbox" id="Shortcut" v-model="isUsingShortcut" />
        <label for="Shortcut">Shortcut</label>
        <input type="checkbox" id="Smeared Joker" v-model="isUsingSmearedJoker" />
        <label for="Smeared Joker">Smeared Joker</label>
      </div>
    </section>

    <section class="text-center">
      <h2 class="mt-8 text-xl font-bold">Your Playing Hand</h2>
      <PlayingHandRow class="w-1/3 mx-auto mt-4" v-model="playingHand" />
      <p class="mt-4">Your playing hand is {{ handType }}</p>
      <p class="font-bold mt-4">Explanation</p>
      <template v-if="isHandStraight">
        <p>Your ranks:</p>
        <p>
          <template v-for="([suit, rank], index) in qualifyingHand" :key="rank">
            <span class="font-bold text-lg tracking-tight" :class="[getSuitColor(suit)]">
              {{ getSuitSymbol(suit) }}
              {{ getRankLabel(rank) }}
            </span>
            <template v-if="qualifyingHand[index + 1] != null">
              <span
                class="font-bold"
                :class="{
                  ['text-green-400']: qualifyingHand[index + 1]?.[1] === rank + 2,
                }"
                :key="`arrow-${index}`"
              >
                ->
              </span>
            </template>
          </template>
        </p>
        <p v-if="isUsingShortcut" class="text-xs">
          Shortcut enabled: <span class="text-green-400 font-bold">-></span> allows skipping one
          rank
        </p>

        <p v-if="isUsingFourFingers" class="text-xs">
          Four Fingers enabled: only 4 cards are required for Straight
        </p>
      </template>

      <template v-if="isHandFlush">
        <p class="mt-4">Your suits:</p>
        <ul class="flex gap-4 justify-center">
          <template v-for="[suit, rank] in suitSortedHand" :key="rank">
            <li class="font-bold text-lg" :class="[getSuitColor(suit)]">
              {{ getSuitSymbol(suit) }}
            </li>
          </template>
        </ul>
        <p v-if="isUsingFourFingers" class="text-xs">
          Four Fingers enabled: only 4 cards is required for Flush
        </p>
        <p v-if="isUsingSmearedJoker" class="text-xs">
          Smeared Joker enabled: {{ getSuitSymbol(CardSuit.Spade) }} Spades and
          {{ getSuitSymbol(CardSuit.Club) }} Clubs are considered the same color; Same for
          {{ getSuitSymbol(CardSuit.Heart) }} Hearts and
          {{ getSuitSymbol(CardSuit.Diamond) }} Diamonds
        </p>
      </template>
    </section>

    <section>
      <h2 class="text-center mt-8 text-xl font-bold">Cards</h2>
      <CardGrid class="mt-4" v-model="playingHand" />
    </section>
  </main>
</template>

<style scoped></style>
