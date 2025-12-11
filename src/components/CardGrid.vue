<script setup lang="ts">
import { CardRank, CardSuit, type PlayingHand } from '../types'
import PlayingCard from './PlayingCard.vue'

const playingHand = defineModel<PlayingHand>({ default: () => [] })

const cardSuits = Object.values(CardSuit).filter((s) => {
  if (typeof s === 'number') {
    return true
  }

  return false
})

const cardRanks = Object.values(CardRank).filter((r) => {
  if (typeof r === 'number') {
    return true
  }

  return false
})

const handleCardClicked = (suit: CardSuit, rank: CardRank) => {
  if (playingHand.value.length >= 5) {
    return
  }

  playingHand.value = [...playingHand.value, [suit, rank]]
}
</script>

<template>
  <ul class="grid grid-rows-4">
    <li v-for="suit in cardSuits" :key="suit">
      <ul class="grid grid-cols-13">
        <PlayingCard
          v-for="rank in cardRanks"
          :key="`${suit}-${rank}`"
          class="-ml-4 hover:z-10"
          :rank="rank as CardRank"
          :suit="suit as CardSuit"
          @card-clicked="handleCardClicked(suit as CardSuit, rank as CardRank)"
        />
      </ul>
    </li>
  </ul>
</template>

<style scoped></style>
