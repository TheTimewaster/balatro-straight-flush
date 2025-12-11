<template>
  <li class="perspective-distant">
    <div
      ref="cardContainer"
      class="aspect-3/4 rounded-lg shadow-md border border-gray-300 hover:scale-110 transition-transform rotate-x-(--rotate-x) rotate-y-(--rotate-y) cursor-pointer relative w-20 bg-(image:--bg-url) bg-position-(--bg-position) bg-no-repeat bg-(color:white) [image-rendering:pixelated] bg-white bg-size-(--bg-size)"
      :class="[cardColor]"
      :style="{
        '--tw-rotate-x': `rotateX(${roll}deg)`,
        '--tw-rotate-y': `rotateY(${tilt}deg)`,
        '--bg-url': `url('${BASE_URL}8BitDeck.png')`,
        '--card-rank': rank - 2,
        // based on the asset, Spades is the last row
        '--card-suit': suit === CardSuit.Spade ? 3 : suit - 1,
        // the factor to calculate background position is based on the asset layout
        '--bg-position': 'calc((var(--card-rank) / 13) * ((1/12 * 100%) + 100%)) calc((var(--card-suit)/4) * ((1/3 * 100%) + 100%))',
        '--bg-size': 'calc(13 * 100%) calc(4 * 100%)',
      }"
      @click="emit('cardClicked')"
    >
      <!-- <div class="text-center text-lg absolute top-2 left-2 leading-4 font-bold">
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
      </div> -->
    </div>
  </li>
</template>

<script setup lang="ts">
import { CardRank, CardSuit } from '@/types'
import getRankLabel from '@/utils/getRankLabel'
import getSuitColor from '@/utils/getSuitColor'
import getSuitSymbol from '@/utils/getSuitSymbol'
import { computed, useTemplateRef } from 'vue'
import useCardTiltRoll from './composables/useCardTiltRoll'

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

const BASE_URL = import.meta.env.BASE_URL
</script>

<style scoped></style>
