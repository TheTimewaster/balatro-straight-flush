import { CardSuit, type PlayingHand } from "@/types"
import { computed, unref, type MaybeRef, type Ref } from "vue"

export default (
  playingHand: Readonly<MaybeRef<PlayingHand>>,
  isQualifyingForEvaluation: Readonly<MaybeRef<boolean>>,
  isUsingSmearedJoker: Readonly<Ref<boolean>>,
  isUsingFourFingers: Readonly<Ref<boolean>>
) => {

  const suitSortedHand = computed<PlayingHand>(() => {
    const playingHandRaw = unref(playingHand)
  return [...playingHandRaw].sort((a, b) => a[0] - b[0])
})
const isHandFlush = computed(() => {
  const isQualifyingForEvaluationRaw = unref(isQualifyingForEvaluation)
  const playingHandRaw = unref(playingHand)

  if (!isQualifyingForEvaluationRaw) {
    return false
  }

  const suitCardCount = new Map<CardSuit, number>()

  playingHandRaw.forEach(([suit]) => {
    const currentCount = suitCardCount.get(suit) ?? 0
    suitCardCount.set(suit, currentCount + 1)
  })

  if (isUsingSmearedJoker.value) {
    const colorCount = Array(2).fill(0) // [black suits, red suits]
    for (const [suit, count] of suitCardCount) {
      if (suit === CardSuit.Spade || suit === CardSuit.Club) {
        colorCount[0] += count

        if (colorCount[0] >= 5 || (isUsingFourFingers.value && colorCount[0] >= 4)) {
          return true
        }
      } else {
        colorCount[1] += count

        if (colorCount[1] >= 5 || (isUsingFourFingers.value && colorCount[1] >= 4)) {
          return true
        }
      }
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
    isHandFlush
}
}
