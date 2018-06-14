import type { Card } from '../model/Card'
import type { Exposure } from '../model/Exposure'

export type ScreenProps = {|
  addCard: (card: Card) => void,
  addExposure: (exposure: Exposure) => void,
  deleteCard: (card: Card) => void,
  editCard: (card: Card) => void,
  allCards: Array<Card>,
  speakCards: Array<Card>,
|}