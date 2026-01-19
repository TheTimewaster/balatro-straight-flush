<template>
  <section>
    <h2 class="mt-8 text-center text-xl font-bold">Your Jokers</h2>
    <p class="text-center text-xs">
      Some jokers can help to create hands more easily. Toggle them on or off to see how they affect
      your hand.
    </p>
    <div class="mt-4 flex justify-center gap-4">
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
        :joker-x="4"
        name="Smeared Joker"
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
