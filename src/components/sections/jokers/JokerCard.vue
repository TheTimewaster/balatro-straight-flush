<template>
  <div
    ref="cardContainer"
    class="bg-(color:white) relative aspect-3/4 w-20 rotate-x-(--rotate-x) rotate-y-(--rotate-y) cursor-pointer rounded-lg border border-gray-300 bg-white bg-(image:--bg-url) bg-size-(--bg-size) bg-position-(--bg-position) bg-no-repeat shadow-md transition-transform [image-rendering:pixelated] hover:scale-110"
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
import useCardTiltRoll from '@/components/composables/useCardTiltRoll'
import { useTemplateRef } from 'vue'
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
