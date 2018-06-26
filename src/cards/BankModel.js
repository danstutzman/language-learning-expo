import type { Card } from './Card'

export type BankModel = {|
  ancestorLeafIdsCsvsByLeafIdCsv: {[string]: Array<string>},
  descendantLeafIdsCsvsByLeafIdCsv: {[string]: Array<string>},
  cardByLeafIdsCsv: {[string]: Card},
  stageToLeafIdsCsvs: {[number]: Array<string>},
|}