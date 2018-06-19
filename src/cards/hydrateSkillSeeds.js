import type { CardType } from './enums/CardType'
import type { Card } from './Card'
import Inf from './verbs/Inf'
import RegV from './verbs/RegV'
import RegVPattern from './verbs/RegVPattern'
import type { Skill } from './Skill'

type SkillSeed = {|
  cardType: CardType,
  cardKey: string,
  mnemonic: string,
|}

const skillSeeds: Array<SkillSeed> = [
  { cardType: 'Inf',
    cardKey: 'pregunt-AR',
    mnemonic: '',
  },
  { cardType: 'RegVPattern',
    cardKey: 'AR11PRES',
    mnemonic: '',
  },
  { cardType: 'RegV',
    cardKey: 'pregunt-ARAR11PRES',
    mnemonic: '',
  },
]

export default function hydrateSkillSeeds(
  cardByCardId: {[number]: Card}
): Array<Skill> {
  const cardByTypeAndKey = {
    Inf: {},
    RegVPattern: {},
    RegV: {},
  }
  for (const card of Object.values(cardByCardId)) {
    if (card instanceof Inf) {
      cardByTypeAndKey.Inf[card.getKey()] = card
    } else if (card instanceof RegVPattern) {
      cardByTypeAndKey.RegVPattern[card.getKey()] = card
    } else if (card instanceof RegV) {
      cardByTypeAndKey.RegV[card.getKey()] = card
    } else {
      throw new Error(`Unexpected card type for ${JSON.stringify(card)}`)
    }
  }

  return skillSeeds.map(seed => {
    const cardByKey = cardByTypeAndKey[seed.cardType]
    if (cardByKey === undefined) {
      throw new Error(`Unexpected card type ${seed.cardType}`)
    }
    const card = cardByKey[seed.cardKey]
    if (card === undefined) {
      throw new Error(`Can't find card for ${JSON.stringify(seed)}`)
    }

    return {
      card,
      mnemonic: seed.mnemonic,
      delay: 0,
      endurance: 0,
    }
  })
}