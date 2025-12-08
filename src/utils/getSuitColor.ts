import { CardSuit } from '@/types'
import tw from './tw'

export default (suit: CardSuit) => {
  switch (suit) {
    case CardSuit.Heart:
      return tw`text-hearts`
    case CardSuit.Club:
      return tw`text-clubs`
    case CardSuit.Diamond:
      return tw`text-diamonds`
  }

  return tw`text-spades`
}
