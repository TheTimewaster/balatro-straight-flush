<template>
  <div>
    <input class="hidden" type="checkbox" :id="identifier" :value="isToggled" />
    <a
      class="block perspective-distant"
      :class="{
        'opacity-30': !isToggled,
      }"
      :aria-describedby="`${identifier}-label`"
      @click="toggle"
    >
      <JokerCard :joker-x="jokerX" :joker-y="jokerY" />
    </a>
    <label class="block text-center" :for="identifier" :id="`${identifier}-label`">{{
      name
    }}</label>
  </div>
</template>

<script setup lang="ts">
import JokerCard from './JokerCard.vue'

const isToggled = defineModel<boolean>({ default: false })
const { jokerX, jokerY, identifier } = defineProps<{
  identifier: string
  name: string
  jokerX: number
  jokerY: number
}>()

const toggle = () => {
  isToggled.value = !isToggled.value
}
</script>

<style scoped></style>
