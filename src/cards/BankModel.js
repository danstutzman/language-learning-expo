import type { Card } from './Card'
import type { Category } from './Category'
import type { Skill } from './Skill'

export type BankModel = {|
  cardByCardId: {[number]: Card},
  categoryToCardIds: {[Category]: Array<number>},
  parentCardIdsByCardId: {[number]: Array<number>},
  skillByCardId: {[number]: Skill},
|}