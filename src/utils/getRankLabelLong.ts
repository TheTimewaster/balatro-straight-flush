import { CardRank } from '@/types'

export default (rank: CardRank) => {
  switch (rank) {
    case CardRank.Ace:
      return 'Ace'
    case CardRank.Jack:
      return 'Jack'
    case CardRank.Queen:
      return 'Queen'
    case CardRank.King:
      return 'King'
    default:
      return rank.toString()
  }
}
