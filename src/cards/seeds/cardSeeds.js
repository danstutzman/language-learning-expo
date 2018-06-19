import type { InfCategory } from '../enums/InfCategory'
import type { Number } from '../enums/Number'
import type { Person } from '../enums/Person'
import type { Tense } from '../enums/Tense'

export type InfSeed = {|
  type: 'Inf',
  es: string,
  en: string,
  infCategory: InfCategory,
|}

export type RegVSeed = {|
  type: 'RegV',
  infKey: string,
  patternKey: string,
|}

export type RegVPatternSeed = {|
  type: 'RegVPattern',
  es: string,
  infCategory: InfCategory,
  number: Number,
  person: Person,
  tense: Tense,
|}

export type CardSeed = InfSeed | RegVSeed | RegVPatternSeed

export default ([
  { type: 'Inf',
    es: 'preguntar',
    en: 'ask',
    infCategory: 'AR',
  },
  { type: 'RegVPattern',
    infCategory: 'AR',
    number: 1,
    person: 1,
    tense: 'PRES',
    es: '-o',
  },
  { type: 'RegV',
    infKey: 'preguntar',
    patternKey: 'AR11PRES',
  },
]: Array<CardSeed>)