<template>
  <div>
    <input :id="identifier" class="hidden" type="checkbox" :value="isToggled" />
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
    <label :id="`${identifier}-label`" class="block text-center" :for="identifier">{{
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
