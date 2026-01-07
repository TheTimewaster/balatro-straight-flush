<template>
  <section>
    <h2 class="text-center mt-8 text-xl font-bold">Your Jokers</h2>
    <p class="text-xs text-center">
      Some jokers can help to create hands more easily. Toggle them on or off to see how they affect
      your hand.
    </p>
    <div class="mt-4 flex gap-4 justify-center">
      <!-- four fingers -->
      <JokerItem
        v-model="isUsingFourFingers"
        identifier="FourFingers"
        name="Four Fingers"
        :joker-x="6"
        :joker-y="6"
      />
      <!-- shortcut -->
      <JokerItem
        v-model="isUsingShortcut"
        identifier="Shortcut"
        name="Shortcut"
        :joker-x="3"
        :joker-y="12"
      />

      <!-- smeared joker -->
      <JokerItem
        v-model="isUsingSmearedJoker"
        identifier="SmearedJoker"
        name="Smeared Joker"
        :joker-x="4"
        :joker-y="6"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import useJokerState from '@/composables/useJokerState'
import JokerItem from './JokerItem.vue'

const { isUsingFourFingers, isUsingShortcut, isUsingSmearedJoker } = useJokerState()
</script>

<style scoped></style>
