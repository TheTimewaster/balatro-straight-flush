<template>
  <p>
    <JokerDescriptionTextPart
      v-for="(part, index) in description"
      :key="`description-part-${index}`"
      :part="part"
    />
  </p>
</template>

<script lang="ts" setup>
import type { JokerDescriptionPart } from '@/types'
import JokerDescriptionTextPart from './JokerDescriptionTextPart.vue'

const {} = defineProps<{
  description: Array<JokerDescriptionPart>
}>()
</script>
