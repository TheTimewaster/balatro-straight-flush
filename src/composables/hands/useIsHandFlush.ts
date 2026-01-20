import { CardSuit, type PlayingHand } from '@/types'
import { computed, unref, type MaybeRefOrGetter } from 'vue'
import useJokerState from '../useJokerState'
import useIsQualifyingForStraightOrFlush from './useIsQualifyingForStraightOrFlush'

export default (playingHand: MaybeRefOrGetter<PlayingHand>) => {
  const { isUsingFourFingers, isUsingSmearedJoker } = useJokerState()
  const isQualifyingForEvaluation = useIsQualifyingForStraightOrFlush(playingHand)

  const suitSortedHand = computed<PlayingHand>(() => {
    const playingHandRaw = unref(playingHand) as PlayingHand
    return [...playingHandRaw].sort((a, b) => a[0] - b[0])
  })

  const isHandFlush = computed(() => {
    const playingHandRaw = unref(playingHand) as PlayingHand

    if (!isQualifyingForEvaluation.value) {
      return false
    }

    const m = Object.keys(CardSuit)
      .filter((s) => typeof s === 'number')
      .map((suit) => [suit, 0]) as [CardSuit, number][]

    const suitCardCount = new Map<CardSuit, number>(m)

    playingHandRaw.forEach(([suit, _, isWildcardEnabled, isDebuffed]) => {
      if (!isDebuffed) {
        const currentCount = suitCardCount.get(suit) ?? 0
        suitCardCount.set(suit, currentCount + 1)
      }

      // once a card is a wild card, every suit gets +1 count
      if (isWildcardEnabled && !isDebuffed) {
        suitCardCount.forEach((_, innerSuit) => {
          const currentCount = suitCardCount.get(innerSuit) ?? 0
          suitCardCount.set(innerSuit, currentCount + 1)
        })
      }
    })

    if (isUsingSmearedJoker.value) {
      // since the data is already structured, we can counting from the set directly
      const blackColorCount =
        (suitCardCount.get(CardSuit.Spade) ?? 0) + (suitCardCount.get(CardSuit.Club) ?? 0)
      const redColorCount =
        (suitCardCount.get(CardSuit.Heart) ?? 0) + (suitCardCount.get(CardSuit.Diamond) ?? 0)
      if (isUsingFourFingers.value && (blackColorCount >= 4 || redColorCount >= 4)) {
        return true
      }

      if (blackColorCount >= 5 || redColorCount >= 5) {
        return true
      }
    }

    for (const [, count] of suitCardCount) {
      if (count >= 5 || (isUsingFourFingers.value && count >= 4)) {
        return true
      }
    }

    return false
  })

  return {
    suitSortedHand,
    isHandFlush,
  }
}
