<template>
  <li class="flex justify-center perspective-distant">
    <div
      ref="cardContainer"
      class="bg-(color:white) relative aspect-3/4 w-20 rotate-x-(--rotate-x) rotate-y-(--rotate-y) cursor-pointer rounded-lg border border-gray-300 bg-white bg-(image:--bg-url) bg-size-(--bg-size) bg-position-(--bg-position) bg-no-repeat shadow-md transition-transform [image-rendering:pixelated] hover:scale-110"
      :class="[cardColor]"
      :style="{
        '--tw-rotate-x': `rotateX(${roll}deg)`,
        '--tw-rotate-y': `rotateY(${tilt}deg)`,
        '--bg-url': `url('${BASE_URL}8BitDeck.png')`,
        '--card-rank': rank - 2,
        // based on the sprites, Spades is the last row
        '--card-suit': suit === CardSuit.Spade ? 3 : suit - 1,
        '--total-ranks': 13,
        '--total-suits': 4,
        // formular is rank or suit / Number of ranks or suit - 1 * 100%
        '--bg-position':
          'calc((var(--card-rank) / (var(--total-ranks) - 1)) * 100%) calc((var(--card-suit) / (var(--total-suits) - 1)) * 100%)',
        '--bg-size': 'calc(var(--total-ranks) * 100%) calc(var(--total-suits) * 100%)',
      }"
      :title="`Card: ${getRankLabelLong(rank)} of ${getSuitLabel(suit, true)}`"
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
import getRankLabelLong from '@/utils/getRankLabelLong'
import getSuitColor from '@/utils/getSuitColor'
import getSuitLabel from '@/utils/getSuitLabel'
import { computed, useTemplateRef } from 'vue'
import useCardTiltRoll from './composables/useCardTiltRoll'

const { suit, rank } = defineProps<{
  suit: CardSuit
  rank: CardRank
}>()

const emit = defineEmits<{
  (e: 'cardClicked'): void
}>()

const cardColor = computed(() => getSuitColor(suit))

const cardContainer = useTemplateRef<HTMLElement>('cardContainer')
const { tilt, roll } = useCardTiltRoll(cardContainer, {
  tiltRollModifier: 30,
})

const BASE_URL = import.meta.env.BASE_URL
</script>

<style scoped></style>
