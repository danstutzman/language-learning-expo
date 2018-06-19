import type { CardType } from '../enums/CardType'

// [0]: cardType, [1]: cardKey, [2]: mnemonic
export type SkillSeed = [CardType, string, string]

export default ([
  ['Inf','preguntar',''],
  ['RegVPattern','AR11PRES',''],
  ['RegV','preguntarAR11PRES',''],
]: Array<SkillSeed>)