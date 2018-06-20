import type { InfCategory } from '../enums/InfCategory'
import type { Number } from '../enums/Number'
import type { Person } from '../enums/Person'
import type { Tense } from '../enums/Tense'

export type IClauseSeed = {|
  type: 'IClause',
  agentKey: string | null,
  vKey: string,
|}

export type InfSeed = {|
  type: 'Inf',
  es: string,
  enPresent: string,
  enPast: string,
  infCategory: InfCategory,
|}

export type NPSeed = {|
  type: 'NP',
  es: string,
  en: string,
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

export type CardSeed = IClauseSeed
  | InfSeed
  | NPSeed
  | RegVSeed
  | RegVPatternSeed

export default ([
  { type: 'Inf',
    es: 'preguntar',
    enPresent: 'ask',
    enPast: 'asked',
    infCategory: 'AR',
  },
  { type: 'Inf',
    es: 'comer',
    enPresent: 'eat',
    enPast: 'ate',
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
  { type: 'RegVPattern',
    infCategory: 'AR',
    number: 1,
    person: 1,
    tense: 'PRET',
    es: '-é',
  },
  { type: 'RegVPattern',
    infCategory: 'AR',
    number: 1,
    person: 3,
    tense: 'PRET',
    es: '-ó',
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
  { type: 'RegV',
    infKey: 'preguntar',
    patternKey: 'AR11PRET',
  },
  { type: 'RegV',
    infKey: 'preguntar',
    patternKey: 'AR13PRET',
  },
  { type: 'NP',
    en: 'I',
    es: 'yo',
  },
  { type: 'IClause',
    agentKey: 'yo',
    vKey: 'comerER11PRES',
  },
]: Array<CardSeed>)
