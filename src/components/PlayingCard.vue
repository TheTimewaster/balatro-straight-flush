<template>
  <li class="perspective-distant">
    <div
      ref="cardContainer"
      class="aspect-2/3 relative rounded-lg bg-white shadow-md border border-gray-300 hover:scale-105 transition-transform rotate-x-(--rotate-x) rotate-y-(--rotate-y) cursor-pointer"
      :class="[cardColor]"
      :style="{
        '--tw-rotate-x': `rotateX(${roll}deg)`,
        '--tw-rotate-y': `rotateY(${tilt}deg)`,
      }"
      @click="emit('cardClicked')"
    >
      <div class="text-center text-lg absolute top-2 left-2 leading-4 font-bold">
        <p>
          {{ rankLabel }}
        </p>
        <p>
          {{ suitSymbol }}
        </p>
      </div>

      <div class="text-center text-lg absolute bottom-2 right-2 rotate-180 leading-4 font-bold">
        <p>
          {{ rankLabel }}
        </p>
        <p>
          {{ suitSymbol }}
        </p>
      </div>
    </div>
  </li>
</template>

<script setup lang="ts">
import { CardRank, CardSuit } from '@/types'
import { computed, useTemplateRef } from 'vue'
import useCardTiltRoll from './composables/useCardTiltRoll'
import getSuitColor from '@/utils/getSuitColor'
import getSuitSymbol from '@/utils/getSuitSymbol'
import getRankLabel from '@/utils/getRankLabel'

const { suit, rank } = defineProps<{
  suit: CardSuit
  rank: CardRank
}>()

const emit = defineEmits<{
  (e: 'cardClicked'): void
}>()

const suitSymbol = computed(() => getSuitSymbol(suit))

const rankLabel = computed(() => getRankLabel(rank))

const cardColor = computed(() => getSuitColor(suit))

const cardContainer = useTemplateRef<HTMLElement>('cardContainer')
const { tilt, roll } = useCardTiltRoll(cardContainer, {
  tiltRollModifier: 30,
})
</script>

<style scoped></style>
