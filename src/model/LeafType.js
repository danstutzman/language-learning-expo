export type LeafType = 'Det' | 'Inf' | 'N'


export const LEAF_TYPE_TO_DESCRIPTION = {
  Det: 'Determiner',
  Inf: 'Infinitive',
  N: 'Noun',
}

export const LEAF_TYPE_TO_FIELDS = {
  Det: { gender: true },
  Inf: { gender: false },
  N: { gender: true },
}

export function assertLeafType(value: string): LeafType {
  if (LEAF_TYPE_TO_DESCRIPTION[value] === undefined) {
    throw new Error(`Unknown leaf type ${value}`)
  }
  return (value: any)
}
