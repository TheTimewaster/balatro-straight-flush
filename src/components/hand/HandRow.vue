<template>
  <div>
    <ul class="grid grid-cols-5 gap-4">
      <template v-for="(slot, index) in playingHandSlots">
        <HandCard
          v-if="slot != null"
          :key="`${slot[0]}-${slot[1]}-${index}`"
          :suit="slot[0]"
          :rank="slot[1]"
          :is-wildcard-enabled="playingHand[index]?.[2]"
          :is-debuffed="playingHand[index]?.[3]"
          @card-clicked="handleCardClicked(index)"
          @update:is-wildcard-enabled="() => handleWildcardToggle(index)"
          @update:is-debuffed="() => handleDebuffToggle(index)"
        />

        <li v-else :key="`empty-slot-${index}`" class="flex items-start justify-center">
          <div class="aspect-3/4 w-20 rounded-lg border border-gray-400 bg-gray-300"></div>
        </li>
      </template>
    </ul>

    <h3 class="mt-4 text-center">Sort by</h3>
    <div class="mt-4 flex justify-center gap-4">
      <button
        class="cursor-pointer rounded-lg bg-gray-300 px-4 py-2 font-bold transition-colors hover:bg-gray-400 dark:text-indigo-950"
        @click="() => sortBy(SortCriteria.Suit)"
      >
        Suit
      </button>
      <button
        class="cursor-pointer rounded-lg bg-gray-300 px-4 py-2 font-bold transition-colors hover:bg-gray-400 dark:text-indigo-950"
        @click="() => sortBy(SortCriteria.Rank)"
      >
        Rank
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PlayingHand } from '@/types'
import { computed } from 'vue'
import HandCard from './HandCard.vue'

const playingHand = defineModel<PlayingHand>({ default: () => [] })

const playingHandSlots = computed(() => {
  const slots = Array(5).fill(null)

  playingHand.value.forEach(([suit, rank], index) => {
    slots[index] = [suit, rank]
  })

  return slots
})

const handleWildcardToggle = (index: number) => {
  const newHand = [...playingHand.value]
  if (newHand[index]) {
    newHand[index][2] = !newHand[index][2]
    playingHand.value = newHand
  }
}

const handleDebuffToggle = (index: number) => {
  const newHand = [...playingHand.value]
  if (newHand[index]) {
    newHand[index][3] = !newHand[index][3]
    playingHand.value = newHand
  }
}

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
  const sortedHand = [...playingHand.value].sort(([suitA, rankA], [suitB, rankB]) => {
    if (criteria === SortCriteria.Suit) {
      if (suitA === suitB) {
        return rankA - rankB
      }
      return suitA - suitB
    } else {
      if (rankA === rankB) {
        return suitA - suitB
      }
      return rankA - rankB
    }
  })

  playingHand.value = sortedHand
}
</script>

<style scoped></style>
