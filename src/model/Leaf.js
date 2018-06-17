import type { InfCategory } from './InfCategory'
import type { LeafType } from './LeafType'
import type { Number } from './Number'
import type { Person } from './Person'
import type { Tense } from './Tense'

export const BLANK_LEAF: Leaf = {
  leafId: 0,
  gender: '',
  en: '',
  es: '',
  mnemonic: '',
  suspended: false,
  type: 'N',
}

export type Leaf = {|
  type: LeafType,
  leafId: number,
  en: string,
  es: string,
  mnemonic: string,
  suspended: boolean,

  gender?: string,
  infCategory?: InfCategory,
  number?: Number,
  person?: Person,
  tense?: Tense,
|}
