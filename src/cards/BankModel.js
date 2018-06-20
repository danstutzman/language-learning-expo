import type { Card } from './Card'
import type { Skill } from './Skill'

export type BankModel = {|
  cardByCardId: {[number]: Card},
  parentCardsByCardId: {[number]: Array<Card>},
  skillByCardId: {[number]: Skill},
|}