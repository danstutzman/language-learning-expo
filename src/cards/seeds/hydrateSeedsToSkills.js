import type { Card } from '../Card'
import type { Seed } from './seeds'
import type { Skill } from '../Skill'

export default function hydrateSeedsToSkills(
  seeds: Array<Seed>,
  cardByCardId: {[number]: Card}
): Array<Skill> {
  let cardId = 1
  return seeds.map(seed => {
    return {
      card: cardByCardId[cardId++],
      mnemonic: seed.mnemonic || '',
      delay: 0,
      endurance: 0,
    }
  })
}