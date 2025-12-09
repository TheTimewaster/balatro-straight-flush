import { CardRank, LowAce } from '@/types'

export default (rank: CardRank | LowAce) => {
  switch (rank) {
    case CardRank.Ace:
      return 'A'
    case LowAce.Ace:
      return 'A'
    case CardRank.Jack:
      return 'J'
    case CardRank.Queen:
      return 'Q'
    case CardRank.King:
      return 'K'
    default:
      return rank.toString()
  }
}
