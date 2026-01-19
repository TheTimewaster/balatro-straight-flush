<template>
  <section>
    <h2 class="mt-8 text-center text-xl font-bold">Your Jokers</h2>
    <p class="text-center text-xs">
      Some jokers can help to create hands more easily. Toggle them on or off to see how they affect
      your hand.
    </p>
    <div class="mt-4 flex justify-center gap-4">
      <!-- four fingers -->
      <JokerItem v-model="isUsingFourFingers" v-bind="fourFingersJoker" />
      <!-- shortcut -->
      <JokerItem v-model="isUsingShortcut" v-bind="shortcutJoker" />
      <!-- smeared joker -->
      <JokerItem v-model="isUsingSmearedJoker" v-bind="smearedJoker" />
    </div>
  </section>
</template>

<script setup lang="ts">
import useJokerState from '@/composables/useJokerState'
import JokerItem from './JokerItem.vue'
import { computed } from 'vue'
import { HAND_MODIFYING_JOKERS } from '@/components/data/HandModifyingJokers'
import type { Joker } from '@/types'

const { isUsingFourFingers, isUsingShortcut, isUsingSmearedJoker } = useJokerState()

const fourFingersJoker = computed(
  () => HAND_MODIFYING_JOKERS.find((joker) => joker.identifier === 'FourFingers') as Joker,
)
const shortcutJoker = computed(
  () => HAND_MODIFYING_JOKERS.find((joker) => joker.identifier === 'Shortcut') as Joker,
)
const smearedJoker = computed(
  () => HAND_MODIFYING_JOKERS.find((joker) => joker.identifier === 'SmearedJoker') as Joker,
)
</script>

<style scoped></style>
