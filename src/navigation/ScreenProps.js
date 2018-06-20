import type { BankModel } from '../cards/BankModel'
import type { SkillUpdate } from '../db/SkillUpdate'

export type ScreenProps = {|
  exportDatabase: () => void,
  reseedDatabase: () => Promise<void>,
  updateSkills: (Array<SkillUpdate>) => Promise<void>,
  bankModel: BankModel,
|}