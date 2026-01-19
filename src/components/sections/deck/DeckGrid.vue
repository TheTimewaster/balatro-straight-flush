<script setup lang="ts">
import { CardRank, CardSuit, type PlayingHand } from '../../../types'
import PlayingCard from '@/components/PlayingCard.vue'

const playingHand = defineModel<PlayingHand>({ default: () => [] })

const cardSuits = Object.values(CardSuit).filter((s) => typeof s === 'number')

const cardRanks = Object.values(CardRank).filter((r) => typeof r === 'number')

const handleCardClicked = (suit: CardSuit, rank: CardRank) => {
  if (playingHand.value.length >= 5) {
    return
  }

  playingHand.value = [...playingHand.value, [suit, rank, false, false]]
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
