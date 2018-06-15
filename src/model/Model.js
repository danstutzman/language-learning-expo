import type { Card } from './Card'

export type Model = {|
  allCards: Array<Card>,
  cardIdToCategory: {[number]: string},
  speakCards: Array<Card>,
|}