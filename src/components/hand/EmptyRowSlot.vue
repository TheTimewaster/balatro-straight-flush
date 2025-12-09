<template>
  <li
    class="aspect-2/3 bg-gray-300 rounded-lg border border-gray-400 rotate-(--card-rotate) translate-y-(--card-translate-y) origin-top"
    :key="`empty-slot-${index}`"
    :style="{
      ['--card-rotate']: `${(index - 2) * 4}deg`,
      ['--card-translate-y']: `${Math.abs(Math.pow(index - 2, 3)) * 1.5}px`,
    }"
  ></li>
</template>

<script setup lang="ts">
const { index } = defineProps<{
  index: number
}>()
</script>

<style scoped></style>
