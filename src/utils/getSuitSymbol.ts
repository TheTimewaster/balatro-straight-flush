import { CardSuit } from '@/types'

export default (suit: CardSuit) => {
  switch (suit) {
    case CardSuit.Club:
      return '♣'
    case CardSuit.Diamond:
      return '♦'
    case CardSuit.Heart:
      return '♥'
  }

  return '♠'
}
