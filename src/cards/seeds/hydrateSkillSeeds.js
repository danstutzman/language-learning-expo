import type { Card } from '../Card'
import IClause from '../IClause'
import Inf from '../verbs/Inf'
import NP from '../NP'
import RegV from '../verbs/RegV'
import RegVPattern from '../verbs/RegVPattern'
import type { Skill } from '../Skill'
import type { SkillSeed } from './skillSeeds'

export default function hydrateSkillSeeds(
  skillSeeds: Array<SkillSeed>,
  cardByCardId: {[number]: Card}
): Array<Skill> {
  const cardByTypeAndKey = {
    IClause: {},
    Inf: {},
    NP: {},
    RegVPattern: {},
    RegV: {},
  }
  for (const card of Object.values(cardByCardId)) {
    if (card instanceof IClause) {
      cardByTypeAndKey.IClause[card.getKey()] = card
    } else if (card instanceof Inf) {
      cardByTypeAndKey.Inf[card.getKey()] = card
    } else if (card instanceof NP) {
      cardByTypeAndKey.NP[card.getKey()] = card
    } else if (card instanceof RegVPattern) {
      cardByTypeAndKey.RegVPattern[card.getKey()] = card
    } else if (card instanceof RegV) {
      cardByTypeAndKey.RegV[card.getKey()] = card
    } else {
      throw new Error(`Unexpected card type for ${JSON.stringify(card)}`)
    }
  }

  return skillSeeds.map(skillSeed => {
    const {
      cardType,
      cardKey,
      mnemonic,
      delay,
      endurance,
      lastCorrectAt,
    } = skillSeed

    const cardByKey = cardByTypeAndKey[cardType]
    if (cardByKey === undefined) {
      throw new Error(`Unexpected card type ${cardType}`)
    }
    const card = cardByKey[cardKey]
    if (card === undefined) {
      throw new Error(`Can't find card for ${JSON.stringify(skillSeed)}`)
    }

    return {
      card,
      cardId: card.cardId,
      mnemonic,
      delay,
      endurance,
      lastCorrectAt,
    }
  })
}