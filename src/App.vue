<script setup lang="ts">
import getRankLabel from '@/utils/getRankLabel'
import getSuitColor from '@/utils/getSuitColor'
import getSuitSymbol from '@/utils/getSuitSymbol'
import { computed, ref } from 'vue'
import CardGrid from './components/CardGrid.vue'
import useIsHandFlush from './components/composables/hands/useIsHandFlush'
import useIsHandStraight from './components/composables/hands/useIsHandStraight'
import useJokerState from './components/composables/useJokerState'
import PlayingHandRow from './components/hand/HandRow.vue'
import JokerItem from './components/JokerItem.vue'
import { CardSuit, type PlayingHand } from './types'

const playingHand = ref<PlayingHand>([])

const { isUsingFourFingers, isUsingShortcut, isUsingSmearedJoker } = useJokerState(playingHand)

const toggleJoker = (jokerType: 'fourFingers' | 'shortcut' | 'smearedJoker') => {
  if (jokerType === 'fourFingers') {
    isUsingFourFingers.value = !isUsingFourFingers.value
  } else if (jokerType === 'shortcut') {
    isUsingShortcut.value = !isUsingShortcut.value
  } else if (jokerType === 'smearedJoker') {
    isUsingSmearedJoker.value = !isUsingSmearedJoker.value
  }
}

const isQualifyingForEvaluation = computed((): boolean => {
  if (isUsingFourFingers.value) {
    return playingHand.value.length >= 4
  } else {
    return playingHand.value.length >= 5
  }
})

const { isHandStraight, qualifyingStraightHand } = useIsHandStraight(
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
  <main class="max-w-3/5 mx-auto my-8">
    <h1 class="text-center text-2xl font-bold">Balatro - Straight/Flush</h1>
    <p class="text-center">Is your playing hand a Straight, Flush even both?</p>

    <section>
      <h2 class="text-center mt-8 text-xl font-bold">Your Jokers</h2>
      <div class="mt-4 flex gap-4 justify-center">
        <!-- four fingers -->
        <JokerItem
          identifier="FourFingers"
          name="Four Fingers"
          :joker-x="6"
          :joker-y="6"
          @click="toggleJoker('fourFingers')"
        />
        <!-- shortcut -->
        <JokerItem
          identifier="Shortcut"
          name="Shortcut"
          :joker-x="3"
          :joker-y="12"
          @click="toggleJoker('shortcut')"
        />

        <!-- smeared joker -->
        <JokerItem
          identifier="SmearedJoker"
          name="Smeared Joker"
          :joker-x="4"
          :joker-y="6"
          @click="toggleJoker('smearedJoker')"
        />
      </div>
    </section>

    <section class="text-center">
      <h2 class="mt-8 text-xl font-bold">Your Playing Hand</h2>
      <PlayingHandRow class="w-2/3 mx-auto mt-4" v-model="playingHand" />
      <p class="mt-4">Your playing hand is {{ handType }}</p>
      <p class="font-bold mt-4">Explanation</p>
      <template v-if="isHandStraight">
        <p>Your ranks:</p>
        <p>
          <template v-for="([suit, rank], index) in qualifyingStraightHand" :key="rank">
            <span class="font-bold text-lg tracking-tight" :class="[getSuitColor(suit)]">
              {{ getSuitSymbol(suit) }}
              {{ getRankLabel(rank) }}
            </span>
            <template v-if="qualifyingStraightHand[index + 1] != null">
              <span
                class="font-bold"
                :class="{
                  ['text-green-400']: qualifyingStraightHand[index + 1]?.[1] === rank + 2,
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
