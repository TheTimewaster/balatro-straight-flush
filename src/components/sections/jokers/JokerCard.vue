<template>
  <div
    ref="cardContainer"
    class="aspect-3/4 rounded-lg shadow-md border border-gray-300 hover:scale-110 transition-transform rotate-x-(--rotate-x) rotate-y-(--rotate-y) cursor-pointer relative w-20 bg-(image:--bg-url) bg-position-(--bg-position) bg-no-repeat bg-(color:white) [image-rendering:pixelated] bg-white bg-size-(--bg-size)"
    :style="{
      '--tw-rotate-x': `rotateX(${roll}deg)`,
      '--tw-rotate-y': `rotateY(${tilt}deg)`,
      '--bg-url': `url('${BASE_URL}8BitJokers.png')`,
      '--joker-x': jokerX,
      '--joker-y': jokerY,
      '--bg-position': `
        calc(var(--joker-x) / (${JOKER_SPRITE_COLUMNS} - 1) * 100%)
        calc(var(--joker-y) / (${JOKER_SPRITE_ROWS} - 1) * 100%)
        `,
      '--bg-size': '1000%',
    }"
  ></div>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue'
import useCardTiltRoll from '@/components/composables/useCardTiltRoll'
const JOKER_SPRITE_COLUMNS = 10
const JOKER_SPRITE_ROWS = 16
const { jokerX, jokerY } = defineProps<{
  /**
   * X position of the joker in the sprite sheet (0-9)
   */
  jokerX: number
  /**
   * Y position of the joker in the sprite sheet (0-15)
   */
  jokerY: number
}>()

const cardContainer = useTemplateRef<HTMLElement>('cardContainer')
const { roll, tilt } = useCardTiltRoll(cardContainer, {
  tiltRollModifier: 30,
})

const BASE_URL = import.meta.env.BASE_URL as string
</script>

<style scoped></style>
