import { CardSuit, type Joker } from '@/types'

export const HAND_MODIFYING_JOKERS: Array<Joker> = [
  {
    identifier: 'FourFingers',
    name: 'Four Fingers',
    description: [
      'All ',
      {
        highlighted: true,
        text: 'Flushes',
      },
      ' and ',
      {
        highlighted: true,
        text: 'Straights',
      },
      ' can be made with ',
      {
        highlighted: true,
        text: '4',
      },
      ' cards',
    ],
    spriteX: 6,
    spriteY: 6,
  },
  {
    identifier: 'Shortcut',
    name: 'Shortcut',
    description: [
      'Allows ',
      {
        highlighted: true,
        text: 'Straights',
      },
      ' to be made with gaps of ',
      {
        highlighted: true,
        text: ' 1 rank ',
      },
      {
        muted: true,
        text: [
          '(ex: ',
          {
            highlighted: true,
            text: '10 8 6 5 3',
          },
          ')',
        ],
      },
    ],
    spriteX: 3,
    spriteY: 12,
  },
  {
    identifier: 'SmearedJoker',
    name: 'Smeared Joker',
    description: [
      {
        suit: CardSuit.Heart,
        text: 'Heart',
      },
      ' and ',
      {
        suit: CardSuit.Diamond,
        text: 'Diamond',
      },
      ' count as the same suit, ',
      {
        suit: CardSuit.Spade,
        text: 'Spade',
      },
      ' and ',
      {
        suit: CardSuit.Club,
        text: 'Club',
      },
      ' count as the same suit',
    ],
    spriteX: 4,
    spriteY: 6,
  },
]
