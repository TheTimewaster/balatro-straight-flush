export enum CardSuit {
  Spade = 0,
  Heart = 1,
  Club = 2,
  Diamond = 3,
}
export enum LowAce {
  Ace = 1,
}

export enum CardRank {
  Two = 2,
  Three = 3,
  Four = 4,
  Five = 5,
  Six = 6,
  Seven = 7,
  Eight = 8,
  Nine = 9,
  Ten = 10,
  Jack = 11,
  Queen = 12,
  King = 13,
  Ace = 14,
}

export type PlayingCard = [CardSuit, CardRank | LowAce]
export type PlayingHand = Array<PlayingCard>
