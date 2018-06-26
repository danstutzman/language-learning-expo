import type { BankModel } from '../cards/BankModel'
import type { CardUpdate } from '../cards/CardUpdate'

export type ScreenProps = {|
  deleteDatabase: () => Promise<void>,
  downloadDatabase: () => Promise<void>,
  updateCards: (cardUpdates: Array<CardUpdate>) => Promise<void>,
  uploadDatabase: () => Promise<void>,
  bankModel: BankModel,
|}