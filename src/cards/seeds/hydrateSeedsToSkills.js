import type { Card } from '../Card'
import { DELAY_THRESHOLD } from '../Skill'
import type { Seed } from './seeds'
import type { Skill } from '../Skill'

export default function hydrateSeedsToSkills(
  seeds: Array<Seed>,
  cardByCardId: {[number]: Card}
): Array<Skill> {
  let nextCardId = 1
  return seeds.map(seed => {
    const cardId = nextCardId++
    const card = cardByCardId[cardId]
    return {
      cardId,
      card,
      mnemonic: seed.mnemonic || '',
      delay: (card.getChildren().length === 0) ?
        DELAY_THRESHOLD : DELAY_THRESHOLD * 2,
      endurance: 0,
    }
  })
}