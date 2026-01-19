<template>
  <div class="group">
    <input :id="identifier" class="hidden" type="checkbox" :value="isToggled" />
    <a
      class="block perspective-distant"
      :class="{
        'opacity-30': !isToggled,
      }"
      :aria-describedby="`${identifier}-label`"
      @click="toggle"
    >
      <JokerCard :joker-x="spriteX" :joker-y="spriteY" />
    </a>
    <label :id="`${identifier}-label`" class="block text-center" :for="identifier">{{
      name
    }}</label>

    <!-- tooltip -->
    <div class="flex justify-center">
      <div
        class="absolute z-10 hidden max-w-40 rounded-xl border-2 border-solid border-white bg-gray-500 p-1 text-center text-white group-hover:block"
      >
        <h3 class="text-2xl">
          {{ name }}
        </h3>

        <div class="tracking rounded-lg bg-white p-1 text-xs leading-4 text-black">
          <JokerDescriptionText :description="description" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { JokerDescriptionPart } from '@/types'
import JokerCard from './JokerCard.vue'
import JokerDescriptionText from './JokerDescriptionText.vue'

const isToggled = defineModel<boolean>({ default: false })
const { spriteX, spriteY, identifier } = defineProps<{
  identifier: string
  name: string
  description: Array<JokerDescriptionPart>
  spriteX: number
  spriteY: number
}>()

const toggle = () => {
  isToggled.value = !isToggled.value
}
</script>

<style scoped></style>
