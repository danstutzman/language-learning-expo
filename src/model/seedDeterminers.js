import type { Card } from './Card'
import type { Leaf } from './Leaf'

const seeds: Array<[string, string]> = [
  ['est-', '-e'],
  ['est-', '-a'],
]

export default function seedDeterminers(
  determinerMorphemes: Array<Leaf>
): Array<Card> {
  const determinerMorphemeByEs: {[string]: Leaf} = {}
  for (const determinerMorpheme of determinerMorphemes) {
    const { es } = determinerMorpheme
    if (determinerMorphemeByEs[es] !== undefined) {
      throw new Error(`Multiple determiner morphemes with same es=${es}`)
    }
    determinerMorphemeByEs[es] = determinerMorpheme
  }

  return seeds.map((seed: [string, string]) => {
    const leaf1 = determinerMorphemeByEs[seed[0]]
    if (leaf1 === undefined) {
      throw new Error(`Can't find determinerMorpheme for es=${seed[0]}`)
    }

    const leaf2 = determinerMorphemeByEs[seed[1]]
    if (leaf2 === undefined) {
      throw new Error(`Can't find determinerMorpheme for es=${seed[1]}`)
    }

    return {
      leafs: [leaf1, leaf2],
      gender: leaf2.gender,
    }
  })
}