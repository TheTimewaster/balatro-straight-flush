import { PokerHandType } from '@/types'

export default (handType: PokerHandType) => {
  switch (handType) {
    case PokerHandType.FlushFive:
      return 'Flush Five'
    case PokerHandType.FlushHouse:
      return 'Flush House'
    case PokerHandType.FiveOfAKind:
      return 'Five of a Kind'
    case PokerHandType.RoyalFlush:
      return 'Royal Flush'
    case PokerHandType.StraightFlush:
      return 'Straight Flush'
    case PokerHandType.FourOfAKind:
      return 'Four of a Kind'
    case PokerHandType.FullHouse:
      return 'Full House'
    case PokerHandType.Flush:
      return 'Flush'
    case PokerHandType.Straight:
      return 'Straight'
    case PokerHandType.ThreeOfAKind:
      return 'Three of a Kind'
    case PokerHandType.TwoPair:
      return 'Two Pair'
    case PokerHandType.Pair:
      return 'Pair'
    case PokerHandType.HighCard:
      return 'High Card'
  }

  return 'empty'
}
