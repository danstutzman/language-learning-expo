import type { Card } from './Card'
import Inf from './verbs/Inf'
import type { InfCategory } from './enums/InfCategory'
import type { Number } from './enums/Number'
import type { Person } from './enums/Person'
import type { Tense } from './enums/Tense'
import RegV from './verbs/RegV'
import RegVPattern from './verbs/RegVPattern'

type InfSeed = {|
  type: 'Inf',
  es: string,
  en: string,
  infCategory: InfCategory,
|}

type RegVSeed = {|
  type: 'RegV',
  infKey: string,
  patternKey: string,
|}

type RegVPatternSeed = {|
  type: 'RegVPattern',
  es: string,
  infCategory: InfCategory,
  number: Number,
  person: Person,
  tense: Tense,
|}

type CardSeed = InfSeed | RegVSeed | RegVPatternSeed

const cardSeeds: Array<CardSeed> = [
  { type: 'Inf',
    es: 'pregunt-',
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
    infKey: 'pregunt-AR',
    patternKey: 'AR11PRES',
  },
]

export default function hydrateCardSeeds(): Array<Card> {
  let cardId = 1

  const infByKey: {[string]: Inf} = {}
  for (const seedUntyped of cardSeeds) {
    if (seedUntyped.type === 'Inf') {
      const seed = (seedUntyped: any)
      const { es, en, infCategory } = seed
      const inf = new Inf(cardId++, es, en, infCategory)
      infByKey[inf.getKey()] = inf
    }
  }

  const regVPatternByKey: {[string]: RegVPattern} = {}
  for (const seedUntyped of cardSeeds) {
    if (seedUntyped.type === 'RegVPattern') {
      const seed = (seedUntyped: any)
      const { es, infCategory, number, person, tense } = seed
      const pattern =
        new RegVPattern(cardId++, es, infCategory, number, person, tense)
      regVPatternByKey[pattern.getKey()] = pattern
    }
  }

  const regVs: Array<RegV> = []
  for (const seedUntyped of cardSeeds) {
    if (seedUntyped.type === 'RegV') {
      const seed = (seedUntyped: any)
      const { infKey, patternKey } = seed
      const inf = infByKey[infKey]
      if (inf === undefined) {
        throw new Error(`Can't find Inf for key=${infKey}`)
      }
      const pattern = regVPatternByKey[patternKey]
      if (pattern === undefined) {
        throw new Error(`Can't find RegVPattern for key=${patternKey}`)
      }
      regVs.push(new RegV(cardId++, inf, pattern))
    }
  }

  return (Object.values(infByKey)
    .concat(Object.values(regVPatternByKey))
    .concat(Object.values(regVs)): any)
}