import { CardSuit } from '@/types'

export default (card: CardSuit, plural = false) => {
  if (plural) {
    switch (card) {
      case CardSuit.Heart:
        return 'Hearts'
      case CardSuit.Diamond:
        return 'Diamonds'
      case CardSuit.Club:
        return 'Clubs'
    }

    return 'Spades'
  }

  switch (card) {
    case CardSuit.Heart:
      return 'Heart'
    case CardSuit.Diamond:
      return 'Diamond'
    case CardSuit.Club:
      return 'Club'
  }

  return 'Spade'
}
