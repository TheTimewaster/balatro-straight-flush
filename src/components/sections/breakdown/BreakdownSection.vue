<template>
  <section>
    <p class="font-bold">Breakdown</p>
    <template v-if="isHandStraight">
      <p>Your ranks:</p>
      <div class="flex items-center justify-center gap-2">
        <template v-for="([suit, rank], index) in qualifyingStraightHand" :key="rank">
          <p class="text-lg font-bold tracking-tight" :class="[getSuitColor(suit)]">
            {{ getSuitSymbol(suit) }}
            {{ getRankLabel(rank) }}
          </p>
          <template v-if="qualifyingStraightHand[index + 1] != null">
            <div
              v-if="qualifyingStraightHand[index + 1]?.[1] === rank + 2"
              :key="`arrow-${index}-green`"
              class="relative text-2xl leading-4 font-bold text-green-400"
            >
              &#8594;
            </div>

            <div v-else :key="`arrow-${index}-white`" class="text-2xl leading-4 font-bold">
              &#8594;
            </div>
          </template>
        </template>
      </div>
      <p v-if="isUsingShortcut" class="text-xs">
        Shortcut enabled:
        <span class="text-lg leading-4 font-bold text-green-400">&#8594;</span> allows you to skip
        one rank
      </p>
      <p v-if="isUsingFourFingers" class="text-xs">
        Four Fingers enabled: only 4 cards are required for Straight
      </p>
    </template>
    <template v-if="isHandFlush || atLeastOneWildcard || atLeastOneDebuffedCard">
      <p class="mt-4">Your suits:</p>
      <ul class="flex justify-center gap-4">
        <template v-for="[suit, rank, isWildcardEnabled, isDebuffed] in suitSortedHand" :key="rank">
          <li class="text-lg font-bold">
            <p v-if="isDebuffed" class="text-pink-500">&#xd7;</p>
            <template v-else>
              <p :class="[getSuitColor(suit)]" class="leading-tighter">
                {{ getSuitSymbol(suit) }}

                <span v-if="isWildcardEnabled" class="text-yellow-400">*</span>
              </p>
            </template>
          </li>
        </template>
      </ul>
      <p v-if="!atLeastOneDebuffedCard && atLeastOneWildcard" class="text-xs">
        You have at least one card with Wildcard (<span class="text-yellow-400">*</span>)
        enhancement. It can be treated as any suit.
      </p>
      <p v-if="atLeastOneDebuffedCard" class="text-xs">
        You have at least one card debuffed (<span class="text-pink-500">&#xd7;</span>). This card
        will not be counted towards Flush.
      </p>
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
import { computed } from 'vue'

const { suitSortedHand } = defineProps<{
  handType: PokerHandType
  isHandStraight: boolean
  isHandFlush: boolean
  qualifyingStraightHand: PlayingHand
  suitSortedHand: PlayingHand
}>()

const { isUsingFourFingers, isUsingSmearedJoker, isUsingShortcut } = useJokerState()

const atLeastOneWildcard = computed(() => {
  return suitSortedHand.some(([, , isWildcardEnabled]) => isWildcardEnabled)
})

const atLeastOneDebuffedCard = computed(() => {
  return suitSortedHand.some(([, , , isDebuffed]) => isDebuffed)
})
</script>

<style scoped></style>
