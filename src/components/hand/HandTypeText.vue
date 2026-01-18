<template>
  <div
    class="inline-block animate-rainbow-shift bg-linear-to-r from-purple-400 via-pink-500 to-purple-400 bg-size-[var(--bg-clip-size)_100%] bg-clip-text text-xl font-extrabold text-transparent"
    style="--bg-clip-size: 400%"
  >
    <span
      v-for="({ character, index }, charIndex) in pokerHandSplitText"
      class="inline-block"
      :class="{
        'animate-up-down-bounce [animation-delay:var(--up-down-bounce-delay)]': index !== -1,
      }"
      :style="{
        '--up-down-bounce-delay': `${(index % 2) * 500}ms`,
      }"
      :key="`${character}-${charIndex}`"
    >
      <template v-if="index === -1">&nbsp;</template>
      <template v-else>{{ character }}</template>
    </span>
  </div>
</template>

<script setup lang="ts">
import type { PokerHandType } from '@/types'
import getPokerHandLabel from '@/utils/getPokerHandLabel'
import { computed } from 'vue'

const { handType } = defineProps<{
  handType: PokerHandType
}>()

const pokerHandSplitText = computed<
  Array<{
    character: string
    index: number
  }>
>(() => {
  const ret = []
  let characterIndex = 0

  for (const char of getPokerHandLabel(handType)) {
    if (char.match(/\s/)) {
      ret.push({
        character: 'nbsp;',
        index: -1,
      })

      continue
    }

    ret.push({
      character: char,
      index: characterIndex,
    })

    characterIndex++
  }

  return ret
})
</script>

<style scoped></style>
