import type { Card } from './Card'
import type { Skill } from './Skill'

export type BankModel = {|
  cardByCardId: {[number]: Card},
  categoryToCardIds: {[string]: Array<number>},
  parentCardIdsByCardId: {[number]: Array<number>},
  skillByCardId: {[number]: Skill},
|}