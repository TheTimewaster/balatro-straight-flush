import { CardRank, PokerHandType, type CardSuit, type PlayingHand } from '@/types'
import { computed, unref, type MaybeRefOrGetter } from 'vue'

export default (rankSortedHand: MaybeRefOrGetter<PlayingHand>) => {
  const rankCountsMap = computed(() => {
    const rankSortedHandRaw = unref(rankSortedHand)
    const newMap = new Map<CardRank, number>()

    for (const [, rank] of rankSortedHandRaw as [CardSuit, CardRank][]) {
      const currentCount = newMap.get(rank) ?? 0
      newMap.set(rank, currentCount + 1)
    }

    return newMap
  })

  const pokerHand = computed(() => {
    // we need to sort the ranks by their counts descending to make evaluation easier
    const countSortedRanks = Array.from<[CardRank, number]>(
      [...rankCountsMap.value.entries()].sort(([, countA], [, countB]) => countB - countA),
    )

    if (countSortedRanks.length === 0) {
      // invalid
      return PokerHandType.EmptyHand
    }

    const highestCount = countSortedRanks[0]?.[1]
    const secondHighestCount = countSortedRanks[1]?.[1]

    if (highestCount == null) return PokerHandType.EmptyHand

    if (highestCount === 5) {
      return PokerHandType.FiveOfAKind
    }

    if (highestCount === 4) {
      return PokerHandType.FourOfAKind
    }

    if (highestCount === 3) {
      if (secondHighestCount === 2) {
        return PokerHandType.FullHouse
      }

      return PokerHandType.ThreeOfAKind
    }

    if (highestCount === 2) {
      if (secondHighestCount === 2) {
        return PokerHandType.TwoPair
      }

      return PokerHandType.Pair
    }

    return PokerHandType.HighCard
  })

  return {
    rankCountsMap,
    pokerHand,
  }
}
