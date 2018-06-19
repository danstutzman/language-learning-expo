import type { InfCategory } from '../enums/InfCategory'
import type { Number } from '../enums/Number'
import type { Person } from '../enums/Person'
import type { Tense } from '../enums/Tense'

export type InfSeed = {|
  type: 'Inf',
  es: string,
  en: string,
  infCategory: InfCategory,
  mnemonic?: string,
|}

export type RegVSeed = {|
  type: 'RegV',
  infKey: string,
  patternKey: string,
  mnemonic?: string,
|}

export type RegVPatternSeed = {|
  type: 'RegVPattern',
  es: string,
  infCategory: InfCategory,
  number: Number,
  person: Person,
  tense: Tense,
  mnemonic?: string,
|}

export type Seed = InfSeed | RegVSeed | RegVPatternSeed

export default ([
  { type: 'Inf',
    es: 'preguntar',
    en: 'ask',
    infCategory: 'AR',
  },
  { type: 'Inf',
    es: 'comer',
    en: 'eat',
    infCategory: 'ER',
  },
  { type: 'RegVPattern',
    infCategory: 'AR',
    number: 1,
    person: 1,
    tense: 'PRES',
    es: '-o',
  },
  { type: 'RegVPattern',
    infCategory: 'AR',
    number: 1,
    person: 3,
    tense: 'PRES',
    es: '-a',
  },
  { type: 'RegVPattern',
    infCategory: 'ER',
    number: 1,
    person: 1,
    tense: 'PRES',
    es: '-o',
  },
  { type: 'RegVPattern',
    infCategory: 'ER',
    number: 1,
    person: 3,
    tense: 'PRES',
    es: '-e',
  },
  { type: 'RegV',
    infKey: 'preguntar',
    patternKey: 'AR11PRES',
  },
  { type: 'RegV',
    infKey: 'preguntar',
    patternKey: 'AR13PRES',
  },
  { type: 'RegV',
    infKey: 'comer',
    patternKey: 'ER11PRES',
  },
  { type: 'RegV',
    infKey: 'comer',
    patternKey: 'ER13PRES',
  },
]: Array<Seed>)