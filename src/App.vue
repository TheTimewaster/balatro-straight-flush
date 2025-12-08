<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import CardGrid from './components/CardGrid.vue'
import PlayingHandRow from './components/PlayingHandRow.vue'
import { CardSuit, type PlayingHand } from './types'
import { useUrlSearchParams } from '@vueuse/core'
import getSuitColor from '@/utils/getSuitColor'
import getRankLabel from '@/utils/getRankLabel'
import getSuitSymbol from '@/utils/getSuitSymbol'

const playingHand = ref<PlayingHand>([])

const isUsingFourFingers = ref(false)
const isUsingShortcut = ref(false)
const isUsingSmearedJoker = ref(false)

const rankSortedHand = computed((): PlayingHand => {
  return [...playingHand.value].sort((a, b) => a[1] - b[1])
})

const suitSortedHand = computed((): PlayingHand => {
  return [...playingHand.value].sort((a, b) => a[0] - b[0])
})

const isQualifyingForEvaluation = computed((): boolean => {
  if (isUsingFourFingers.value) {
    return playingHand.value.length >= 4
  } else {
    return playingHand.value.length >= 5
  }
})

const isHandStraight = computed((): boolean => {
  if (!isQualifyingForEvaluation.value) {
    return false
  }

  const evaluateHand = (startIndex: number, maxCardsToConsider: number) => {
    // look each rank to see if the next is +1
    for (let i = startIndex; i < maxCardsToConsider - 1; i++) {
      const nextRank = rankSortedHand.value[i + 1]?.[1]
      const currentRank = rankSortedHand.value[i]?.[1]

      if (currentRank == null) {
        return false
      }

      // in case we use Shortcut Joker
      if (isUsingShortcut.value) {
        // if the next rank is equal either current rank + 1 or current rank + 2
        if (currentRank + 1 !== nextRank && currentRank + 2 !== nextRank) {
          return false
        }
      } else {
        // is the next rank not equal to current rank + 1?
        if (currentRank + 1 !== nextRank) {
          return false
        }
      }
    }

    return true
  }

  // when using four fingers, we have to consider that only 4 cards are needed
  if (isUsingFourFingers.value) {
    // but if we have 5 cards, we need to check both possibilities
    // start from 0 to 4, or start from 1 to 5
    if (evaluateHand(0, 4)) {
      return true
    }

    return evaluateHand(1, 4)
  }

  return evaluateHand(0, 5)
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
  <main class="p-8">
    <h1 class="text-center text-2xl font-bold">Balatro - Straight/Flush</h1>
    <p class="text-center">Is your playing hand a Straight, Flush, even both?</p>

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
      <PlayingHandRow class="w-1/2 mx-auto mt-4" v-model="playingHand" />
      <p class="mt-4">Your playing hand is {{ handType }}</p>
      <p class="font-bold mt-4">Explanation</p>
      <template v-if="isHandStraight">
        <p>Your ranks:</p>
        <p>
          <template v-for="([suit, rank], index) in rankSortedHand" :key="rank">
            <span class="font-bold text-lg tracking-tight" :class="[getSuitColor(suit)]">
              {{ getSuitSymbol(suit) }}
              {{ getRankLabel(rank) }}
            </span>
            <template v-if="rankSortedHand[index + 1] != null">
              <span
                class="font-bold"
                :class="{
                  ['text-green-400']: rankSortedHand[index + 1]?.[1] === rank + 2,
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
        <p v-if="isUsingShortcut" class="text-xs">
          Shortcut enabled: {{ getSuitSymbol(CardSuit.Spade) }} Spades and
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
