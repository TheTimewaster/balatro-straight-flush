<template>
  <section class="mt-8 text-center">
    <h2 class="text-xl font-bold">Your Playing Hand</h2>
    <HandRow v-model="playingHand" class="mx-auto mt-4 lg:w-2/3" />
    <div class="mt-4">
      Your playing hand is

      <span v-if="handType === PokerHandType.EmptyHand"> empty </span>

      <template v-else>
        a

        <HandTypeText :hand-type="handType" />
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import { PokerHandType, type PlayingHand } from '@/types'
import HandRow from './HandRow.vue'
import HandTypeText from './HandTypeText.vue'

defineProps<{
  handType: PokerHandType
}>()

const playingHand = defineModel<PlayingHand>({
  default: () => [],
})
</script>

<style scoped></style>
