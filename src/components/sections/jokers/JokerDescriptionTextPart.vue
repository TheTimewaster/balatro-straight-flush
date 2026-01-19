<template>
  <template v-if="typeof part === 'string'">{{ part }}</template>
  <span v-else-if="Array.isArray(part.text)" :class="['block', formattingClass]">
    <JokerDescriptionTextPart
      v-for="(subPart, subIndex) in part.text"
      :key="`sub-part-${subIndex}`"
      :part="subPart"
    />
  </span>

  <span v-else-if="part.text" :class="formattingClass">{{ part.text }}</span>
</template>

<script setup lang="ts">
import type {
  JokerDescriptionHighlightedPart,
  JokerDescriptionMutedPart,
  JokerDescriptionPart,
  JokerDescriptionSuitPart,
} from '@/types'
import getSuitColor from '@/utils/getSuitColor'
import tw from '@/utils/tw'
import { computed } from 'vue'

const { part } = defineProps<{
  part: string | JokerDescriptionPart
}>()

const formattingClass = computed(() => {
  if (Array.isArray(part)) {
  }

  if ((part as JokerDescriptionHighlightedPart).highlighted) {
    return tw`text-orange-400`
  }

  if ((part as JokerDescriptionMutedPart).muted) {
    return tw`text-gray-300`
  }

  if ((part as JokerDescriptionSuitPart).suit != null) {
    return [getSuitColor((part as JokerDescriptionSuitPart).suit)]
  }

  return undefined
})
</script>

<style scoped></style>
