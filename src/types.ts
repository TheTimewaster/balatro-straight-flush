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
export type IsWildcardEnabled = boolean
export type IsDebuffed = boolean
export type PlayingHandCard = [...PlayingCard, IsWildcardEnabled, IsDebuffed]
export type PlayingHand = Array<PlayingHandCard>

/**
 * Poker hand types in increasing order of rank.
 * Balatro has an extended ranking system, where deck manipulation allows you to unlock
 * * Five of a Kind
 * * Flush House
 * * Flush Five
 */
export enum PokerHandType {
  EmptyHand = -1,
  HighCard = 0,
  Pair = 1,
  TwoPair = 2,
  ThreeOfAKind = 3,
  Straight = 4,
  Flush = 5,
  FullHouse = 6,
  FourOfAKind = 7,
  StraightFlush = 8,
  RoyalFlush = 9,
  FiveOfAKind = 10,
  FlushHouse = 11,
  FlushFive = 12,
}

export type JokerDescriptionFormattedPart = {
  text: string
}

export type JokerDescriptionHighlightedPart = {
  highlighted: boolean
} & JokerDescriptionFormattedPart

export type JokerDescriptionMutedPart = {
  muted: boolean
  text: Array<string | JokerDescriptionHighlightedPart>
}

export type JokerDescriptionSuitPart = {
  suit: CardSuit
} & JokerDescriptionFormattedPart

export type JokerDescriptionPart =
  | string
  | JokerDescriptionHighlightedPart
  | JokerDescriptionMutedPart
  | JokerDescriptionSuitPart

export type Joker = {
  identifier: string
  name: string
  description: Array<JokerDescriptionPart>
  spriteX: number
  spriteY: number
}
