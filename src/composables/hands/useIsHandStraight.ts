import { CardRank, type PlayingCard, type PlayingHand } from '@/types'
import { computed, reactive, toRefs, unref, watch, type MaybeRefOrGetter } from 'vue'

export default (
  playingHand: MaybeRefOrGetter<PlayingHand>,
  isQualifyingForEvaluation: MaybeRefOrGetter<boolean>,
  isUsingFourFingers: MaybeRefOrGetter<boolean>,
  isUsingShortcut: MaybeRefOrGetter<boolean>,
) => {
  const rankSortedHand = computed<PlayingHand>(() => {
    const playingHandRaw = unref(playingHand)
    return [...(playingHandRaw as PlayingHand)].sort(([, rankA], [, rankB]) => rankA - rankB)
  })

  const state = reactive<{
    qualifyingStraightHand: PlayingHand
    isHandStraight: boolean
  }>({
    qualifyingStraightHand: [],
    isHandStraight: false,
  })

  /**
   * Evaluate card rank recursively to determine if hand is straight
   *
   * @param currentCardIndex - the index of the current card
   * @param lastCardIndex - the maximum number of cards to consider for straight evaluation (changes when using Four Fingers Joker)
   * @returns boolean - whether the hand is straight, recursion ends early if the next card is not consecutive
   */
  const evaluateCardRank = (
    currentCardIndex: number,
    lastCardIndex: number,
    isLowStraight = false,
  ) => {
    const [suit, currentRank] = rankSortedHand.value[currentCardIndex] as PlayingCard
    const isUsingShortcutRaw = unref(isUsingShortcut)

    // end of recursion
    if (currentCardIndex === lastCardIndex - 1) {
      if (isLowStraight && currentRank === CardRank.Ace) {
        // put Ace as low card
        state.qualifyingStraightHand.unshift([suit, 1])
      } else {
        // add last card to qualifying hand
        state.qualifyingStraightHand.push([suit, currentRank])
      }

      return true
    }

    if (rankSortedHand.value[currentCardIndex + 1] == null) {
      return false
    }

    const [, nextRank] = rankSortedHand.value[currentCardIndex + 1] as PlayingCard

    let isConsecutive = false
    if (isUsingShortcutRaw) {
      isConsecutive = nextRank === currentRank + 1 || nextRank === currentRank + 2
    } else {
      isConsecutive = nextRank === currentRank + 1
    }

    if (nextRank === CardRank.Ace && rankSortedHand.value[0] != null) {
      // special case: we have to validate low straights beginning with Ace
      // we look back at the first card to see if it's a 2
      if (rankSortedHand.value[0][1] === CardRank.Two) {
        state.qualifyingStraightHand.push([suit, currentRank])

        return evaluateCardRank(currentCardIndex + 1, lastCardIndex, true)
      }

      // special case: when using shortcut, after Ace we can consider 3 as consecutive to Ace
      if (isUsingShortcutRaw && rankSortedHand.value[0][1] === CardRank.Three) {
        state.qualifyingStraightHand.push([suit, currentRank])

        return evaluateCardRank(currentCardIndex + 1, lastCardIndex, true)
      }
    }

    // consecutive, add to qualifying hand and continue recursion
    if (isConsecutive) {
      state.qualifyingStraightHand.push([suit, currentRank])
      return evaluateCardRank(currentCardIndex + 1, lastCardIndex)
    }

    // not consecutive, end recursion
    return false
  }

  watch([rankSortedHand, isQualifyingForEvaluation, isUsingFourFingers, isUsingShortcut], () => {
    state.isHandStraight = false
    state.qualifyingStraightHand = []
    const isQualifyingForEvaluationRaw = unref(isQualifyingForEvaluation)
    const isUsingFourFingersRaw = unref(isUsingFourFingers)

    if (!isQualifyingForEvaluationRaw) {
      return
    }

    // when using four fingers, we have to consider that only 4 cards are needed
    if (isUsingFourFingersRaw) {
      // but if we have 5 cards, we need to check both possibilities
      // start from 0 to 4, or start from 1 to 5
      if (evaluateCardRank(0, 4)) {
        state.isHandStraight = true
        return
      }

      state.isHandStraight = evaluateCardRank(1, 5)
      return
    }

    state.isHandStraight = evaluateCardRank(0, 5)
  })

  return {
    ...toRefs(state),
    rankSortedHand,
  }
}
