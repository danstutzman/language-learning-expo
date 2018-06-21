import type { Card } from './Card'
import type { Skill } from './Skill'

export type BankModel = {|
  cardByCardId: {[number]: Card},
  parentCardIdsByCardId: {[number]: Array<number>},
  skillByCardId: {[number]: Skill},
|}