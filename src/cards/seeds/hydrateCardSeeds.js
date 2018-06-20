import { assertCardType } from '../enums/CardType'
import type { Card } from '../Card'
import type { CardSeed } from './cardSeeds'
import IClause from '../IClause'
import Inf from '../verbs/Inf'
import NP from '../NP'
import RegV from '../verbs/RegV'
import RegVPattern from '../verbs/RegVPattern'

export default function hydrateCardSeeds(
  cardSeeds: Array<CardSeed>
): Array<Card> {
  let cardId = 1

  for (const seedUntyped of cardSeeds) {
    assertCardType(seedUntyped.type)
  }

  const infByKey: {[string]: Inf} = {}
  for (const seedUntyped of cardSeeds) {
    if (seedUntyped.type === 'Inf') {
      const seed = (seedUntyped: any)
      const { es, enPresent, enPast, infCategory } = seed
      const inf = new Inf(cardId++, es, enPresent, enPast, infCategory)
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

  const regVByKey: {[string]: RegV} = {}
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
      const regV = new RegV(cardId++, inf, pattern)
      regVByKey[regV.getKey()] = regV
    }
  }

  const npByKey: {[string]: NP} = {}
  for (const seedUntyped of cardSeeds) {
    if (seedUntyped.type === 'NP') {
      const seed = (seedUntyped: any)
      const { en, es } = seed

      const np = new NP(cardId++, es, en)
      npByKey[np.getKey()] = np
    }
  }

  const iClauseByKey: {[string]: IClause} = {}
  for (const seedUntyped of cardSeeds) {
    if (seedUntyped.type === 'IClause') {
      const seed = (seedUntyped: any)
      const { agentKey, vKey } = seed

      let agent = null
      if (agentKey !== null) {
        agent = npByKey[agentKey]
        if (agent === undefined) {
          throw new Error(`Can't find NP for key=${agentKey}`)
        }
      }

      const regV = regVByKey[vKey]
      if (regV === undefined) {
        throw new Error(`Can't find RegV for key=${vKey}`)
      }

      const iClause = new IClause(cardId++, agent, regV)
      iClauseByKey[iClause.getKey()] = iClause
    }
  }

  return (Object.values(infByKey)
    .concat(Object.values(regVPatternByKey))
    .concat(Object.values(regVByKey))
    .concat(Object.values(npByKey))
    .concat(Object.values(iClauseByKey))
  : any)
}