<template>
  <div>
    <ul class="grid grid-cols-5 gap-4">
      <template v-for="(slot, index) in playingHandSlots">
        <PlayingCard
          v-if="slot != null"
          :key="`${slot[0]}-${slot[1]}-${index}`"
          :suit="slot[0]"
          :rank="slot[1]"
          @card-clicked="handleCardClicked(index)"
        />

        <li
          class="aspect-2/3 bg-gray-300 rounded-lg border border-gray-400"
          v-else
          :key="`empty-slot-${index}`"
        ></li>
      </template>
    </ul>

    <h3 class="text-center mt-4">Sort by</h3>
    <div class="flex gap-4 justify-center mt-4">
      <button
        class="px-4 py-2 rounded-lg bg-gray-300 font-bold cursor-pointer hover:bg-gray-400 transition-colors"
        @click="() => sortBy(SortCriteria.Suit)"
      >
        Suit
      </button>
      <button
        class="px-4 py-2 rounded-lg bg-gray-300 font-bold cursor-pointer hover:bg-gray-400 transition-colors"
        @click="() => sortBy(SortCriteria.Rank)"
      >
        Rank
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PlayingHand } from '@/types'
import PlayingCard from './PlayingCard.vue'
import { computed } from 'vue'

const playingHand = defineModel<PlayingHand>({ default: () => [] })

const playingHandSlots = computed(() => {
  const slots = Array(5).fill(null)

  playingHand.value.forEach(([suit, rank], index) => {
    slots[index] = [suit, rank]
  })

  return slots
})

const handleCardClicked = (index: number) => {
  const newHand = [...playingHand.value]
  newHand.splice(index, 1)
  playingHand.value = newHand
}

enum SortCriteria {
  Suit = 'suit',
  Rank = 'rank',
}

const sortBy = (criteria: SortCriteria) => {
  const sortedHand = [...playingHand.value].sort((a, b) => {
    if (criteria === SortCriteria.Suit) {
      if (a[0] === b[0]) {
        return a[1] - b[1]
      }

      return a[0] - b[0]
    } else {
      if (a[1] === b[1]) {
        return a[0] - b[0]
      }

      return a[1] - b[1]
    }
  })

  playingHand.value = sortedHand
}
</script>

<style scoped></style>
