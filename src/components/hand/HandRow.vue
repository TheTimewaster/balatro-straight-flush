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

        <li v-else class="perspective-distant flex justify-center" :key="`empty-slot-${index}`">
          <div
            class="aspect-3/4 bg-gray-300 rounded-lg border border-gray-400 w-20"
            :class="slotTransformClasses"
            :style="{
              ...slotTranformStyle(index),
            }"
          ></div>
        </li>
      </template>
    </ul>

    <h3 class="text-center mt-4">Sort by</h3>
    <div class="flex gap-4 justify-center mt-4">
      <button
        class="px-4 py-2 rounded-lg bg-gray-300 font-bold cursor-pointer hover:bg-gray-400 transition-colors dark:text-indigo-950"
        @click="() => sortBy(SortCriteria.Suit)"
      >
        Suit
      </button>
      <button
        class="px-4 py-2 rounded-lg bg-gray-300 font-bold cursor-pointer hover:bg-gray-400 transition-colors dark:text-indigo-950"
        @click="() => sortBy(SortCriteria.Rank)"
      >
        Rank
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import PlayingCard from '@/components/PlayingCard.vue'
import type { PlayingHand } from '@/types'
import tw from '@/utils/tw'
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

const slotTransformClasses = tw`rotate-(--card-rotate) translate-y-(--card-translate-y) origin-(--transform-origin)`

const slotTranformStyle = (index: number) => {
  const offset = index - 2
  const rotationStep = 5 // degrees
  const rotation = offset * rotationStep

  // Calculate Y translation to create a circular arc
  // We simulate a large circle with radius R below the cards
  const radius = 1000
  const angleRad = (Math.abs(rotation) * Math.PI) / 180
  const translateY = radius * (1 - Math.cos(angleRad))

  return {
    '--card-rotate': `${rotation}deg`,
    '--card-translate-y': `${translateY}px`,
    '--transform-origin': 'bottom center',
  }
}
</script>

<style scoped></style>
