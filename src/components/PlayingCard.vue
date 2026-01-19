<template>
  <li class="perspective-distant">
    <div
      ref="cardContainer"
      class="relative aspect-3/4 w-20 rotate-x-(--rotate-x) rotate-y-(--rotate-y) cursor-pointer bg-(image:--bg-url) bg-size-(--bg-size) bg-position-(--bg-position) bg-no-repeat shadow-md transition-transform [image-rendering:pixelated] hover:scale-110"
      :class="[cardColor]"
      :style="cardStyle"
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

    <slot></slot>
  </li>
</template>

<script setup lang="ts">
import { CardRank, CardSuit } from '@/types'
import getRankLabelLong from '@/utils/getRankLabelLong'
import getSuitColor from '@/utils/getSuitColor'
import getSuitLabel from '@/utils/getSuitLabel'
import { computed, useTemplateRef } from 'vue'
import useCardTiltRoll from './composables/useCardTiltRoll'

const {
  suit,
  rank,
  isWildcardEnabled = false,
  isDebuffed = false,
} = defineProps<{
  suit: CardSuit
  rank: CardRank
  isWildcardEnabled?: boolean
  isDebuffed?: boolean
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

const cardStyle = computed(() => {
  const bgUrls = []
  const bgPositions = []
  const bgSizes = []

  // debuff overlay
  if (isDebuffed) {
    bgUrls.push(`url('${BASE_URL}Editions.png')`)
    bgPositions.push('calc((4 / 4) * 100%) 0%') // Debuff position
    bgSizes.push('500% 100%')
  }

  // default card sprites
  bgUrls.push(`url('${BASE_URL}8BitDeck.png')`)
  bgPositions.push(
    'calc((var(--card-rank) / (var(--total-ranks) - 1)) * 100%) calc((var(--card-suit) / (var(--total-suits) - 1)) * 100%)',
  )
  bgSizes.push(`calc(var(--total-ranks) * 100%) calc(var(--total-suits) * 100%)`)

  const baseStyles = {
    '--tw-rotate-x': `rotateX(${roll.value}deg)`,
    '--tw-rotate-y': `rotateY(${tilt.value}deg)`,
    '--card-rank': rank - 2,
    // based on the sprites, Spades is the last row
    '--card-suit': suit === CardSuit.Spade ? 3 : suit - 1,
    '--total-ranks': 13,
    '--total-suits': 4,
  }

  if (isWildcardEnabled) {
    bgUrls.push(`url('${BASE_URL}Enhancements.png')`)
    bgPositions.push('calc((3 / 6) * 100%) calc((1 / 4) * 100%)') // Wildcard position
    bgSizes.push('700% 500%')
  } else {
    bgUrls.push(`url('${BASE_URL}Enhancements.png')`)
    bgPositions.push('calc((1 / 6) * 100%) calc((0 / 4) * 100%)') // base card bg position
    bgSizes.push('700% 500%')
  }

  return {
    ...baseStyles,
    // formular is rank or suit / Number of ranks or suit - 1 * 100%
    '--bg-url': bgUrls.join(', '),
    '--bg-position': bgPositions.join(', '),
    '--bg-size': bgSizes.join(', '),
  }
})
</script>

<style scoped></style>
