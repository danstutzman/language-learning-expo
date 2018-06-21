import type { BankModel } from '../cards/BankModel'
import type { SkillUpdate } from '../db/SkillUpdate'

export type ScreenProps = {|
  deleteDatabase: () => Promise<void>,
  downloadDatabase: () => Promise<void>,
  uploadDatabase: () => Promise<void>,
  updateSkills: (Array<SkillUpdate>) => Promise<void>,
  bankModel: BankModel,
|}