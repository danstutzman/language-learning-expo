import type { Card } from './Card'

export type BankModel = {|
  ancestorCardIdsByCardId: {[number]: Array<number>},
  descendantCardIdsByCardId: {[number]: Array<number>},
  cardByCardId: {[number]: Card},
  leafIdToLeafCardId: {[number]: number},
  stageToCardIds: {[number]: Array<number>},
|}