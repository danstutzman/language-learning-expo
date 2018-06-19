import type { BankModel } from '../cards/BankModel'
import type { Skill } from '../cards/Skill'

export type ScreenProps = {|
  editSkill: (skill: Skill) => void,
  exportDatabase: () => void,
  reseedDatabase: () => Promise<void>,
  bankModel: BankModel,
|}