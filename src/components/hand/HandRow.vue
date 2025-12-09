<template>
  <div>
    <ul class="grid grid-cols-5 gap-4">
      <template v-for="(slot, index) in playingHandSlots">
        <PlayingCard
          v-if="slot != null"
          :key="`${slot[0]}-${slot[1]}-${index}`"
          :suit="slot[0]"
          :rank="slot[1]"
          :class="slotTransformClasses"
          :style="{
            ...slotTranformStyle(index),
          }"
          @card-clicked="handleCardClicked(index)"
        />

        <li
          v-else
          class="aspect-2/3 bg-gray-300 rounded-lg border border-gray-400"
          :class="slotTransformClasses"
          :key="`empty-slot-${index}`"
          :style="{
            ...slotTranformStyle(index),
          }"
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
import PlayingCard from '@/components/PlayingCard.vue'
import { computed } from 'vue'
import tw from '@/utils/tw'

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

const slotTransformClasses = tw`rotate-(--card-rotate) translate-y-(--card-translate-y) origin-top`

const slotTranformStyle = (index: number) => ({
  ['--card-rotate']: `${(index - 2) * 4}deg`,
  ['--card-translate-y']: `${Math.abs(Math.pow(index - 2, 3)) * 1.5}px`,
})
</script>

<style scoped></style>
