<template>
  <PlayingCard
    :key="`${suit}-${rank}`"
    class="flex flex-col items-center"
    :suit="suit"
    :rank="rank"
    :is-wildcard-enabled="isWildcardEnabled"
    :is-debuffed="isDebuffed"
    @card-clicked="emit('cardClicked')"
  >
    <div class="mt-2 w-full md:w-3/4">
      <button
        class="w-full cursor-pointer rounded-t-lg bg-yellow-300 py-1 text-center text-xs font-bold transition-colors hover:bg-yellow-400 dark:text-indigo-950"
        :class="{
          'opacity-50': !isWildcardEnabled,
          'opacity-100': isWildcardEnabled,
        }"
        @click="isWildcardEnabled = !isWildcardEnabled"
      >
        Wildcard
      </button>
      <button
        class="w-full cursor-pointer bg-pink-400 py-1 text-center text-xs text-white transition-colors hover:bg-pink-500"
        :class="{
          'opacity-50': !isDebuffed,
          'opacity-100': isDebuffed,
        }"
        @click="isDebuffed = !isDebuffed"
      >
        Debuff
      </button>
      <button
        class="w-full cursor-pointer rounded-b-lg bg-red-400 py-1 text-center text-xs text-white transition-colors hover:bg-red-500"
        @click="emit('cardClicked')"
      >
        Remove
      </button>
    </div>
  </PlayingCard>
</template>

<script setup lang="ts">
import { CardRank, CardSuit } from '@/types'
import PlayingCard from '@/components/PlayingCard.vue'

const isWildcardEnabled = defineModel<boolean>('isWildcardEnabled', {
  default: false,
})

const isDebuffed = defineModel<boolean>('isDebuffed', {
  default: false,
})

const { rank, suit } = defineProps<{
  rank: CardRank
  suit: CardSuit
}>()

const emit = defineEmits<{
  cardClicked: []
}>()
</script>

<style scoped></style>
