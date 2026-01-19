<template>
  <li
    :key="`empty-slot-${index}`"
    class="aspect-2/3 origin-top translate-y-(--card-translate-y) rotate-(--card-rotate) rounded-lg border border-gray-400 bg-gray-300"
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
