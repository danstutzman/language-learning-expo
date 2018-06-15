import type { Card } from '../model/Card'
import type { Exposure } from '../model/Exposure'
import type { Model } from '../model/Model'

export type ScreenProps = {|
  addCard: (card: Card) => void,
  addExposure: (exposure: Exposure) => void,
  deleteCard: (card: Card) => void,
  editCard: (card: Card) => void,
  model: Model,
|}