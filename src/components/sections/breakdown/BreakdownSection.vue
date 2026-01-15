<template>
  <section>
    <p class="font-bold">Breakdown</p>
    <template v-if="isHandStraight">
      <p>Your ranks:</p>
      <p>
        <template v-for="([suit, rank], index) in qualifyingStraightHand" :key="rank">
          <span class="text-lg font-bold tracking-tight" :class="[getSuitColor(suit)]">
            {{ getSuitSymbol(suit) }}
            {{ getRankLabel(rank) }}
          </span>
          <template v-if="qualifyingStraightHand[index + 1] != null">
            <span
              class="font-bold"
              :class="{
                ['text-green-400']: qualifyingStraightHand[index + 1]?.[1] === rank + 2,
              }"
              :key="`arrow-${index}`"
            >
              ->
            </span>
          </template>
        </template>
      </p>
      <p v-if="isUsingShortcut" class="text-xs">
        Shortcut enabled: <span class="font-bold text-green-400">-></span> allows you to skip one
        rank
      </p>
      <p v-if="isUsingFourFingers" class="text-xs">
        Four Fingers enabled: only 4 cards are required for Straight
      </p>
    </template>
    <template v-if="isHandFlush">
      <p class="mt-4">Your suits:</p>
      <ul class="flex justify-center gap-4">
        <template v-for="[suit, rank] in suitSortedHand" :key="rank">
          <li class="text-lg font-bold" :class="[getSuitColor(suit)]">
            {{ getSuitSymbol(suit) }}
          </li>
        </template>
      </ul>
      <p v-if="isUsingFourFingers" class="text-xs">
        Four Fingers enabled: only 4 cards is required for Flush
      </p>
      <p v-if="isUsingSmearedJoker" class="text-xs">
        Smeared Joker enabled:
        <span :class="[getSuitColor(CardSuit.Spade)]"
          >{{ getSuitSymbol(CardSuit.Spade) }}
          Spades
        </span>
        and
        <span :class="[getSuitColor(CardSuit.Club)]"
          >{{ getSuitSymbol(CardSuit.Club) }}
          Clubs
        </span>
        are considered the same color; Same for
        <span :class="[getSuitColor(CardSuit.Heart)]"
          >{{ getSuitSymbol(CardSuit.Heart) }}
          Hearts
        </span>
        and
        <span :class="[getSuitColor(CardSuit.Diamond)]"
          >{{ getSuitSymbol(CardSuit.Diamond) }}
          Diamonds
        </span>
      </p>
    </template>
  </section>
</template>

<script setup lang="ts">
import useJokerState from '@/composables/useJokerState'
import { CardSuit, PokerHandType, type PlayingHand } from '@/types'
import getRankLabel from '@/utils/getRankLabel'
import getSuitColor from '@/utils/getSuitColor'
import getSuitSymbol from '@/utils/getSuitSymbol'

defineProps<{
  handType: PokerHandType
  isHandStraight: boolean
  isHandFlush: boolean
  qualifyingStraightHand: PlayingHand
  suitSortedHand: PlayingHand
}>()

const { isUsingFourFingers, isUsingSmearedJoker, isUsingShortcut } = useJokerState()
</script>

<style scoped></style>
