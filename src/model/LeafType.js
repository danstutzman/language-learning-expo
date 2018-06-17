export type LeafType = 'Det' | 'Inf' | 'N' | 'RegVPattern'

export const LEAF_TYPE_TO_DESCRIPTION = {
  Det: 'Determiner',
  Inf: 'Infinitive',
  N: 'Noun',
  RegVPattern: 'Verb pattern',
}

export const LEAF_TYPE_TO_FIELDS = {
  Det: {
    gender: true,
    infCategory: false,
    number: false,
    person: false,
    tense: false,
  },
  Inf: {
    gender: false,
    infCategory: false,
    number: false,
    person: false,
    tense: false,
  },
  N: {
    gender: true,
    infCategory: false,
    number: false,
    person: false,
    tense: false,
  },
  RegVPattern: {
    gender: false,
    infCategory: true,
    number: true,
    person: true,
    tense: true,
  },
}

export function assertLeafType(value: string): LeafType {
  if (LEAF_TYPE_TO_DESCRIPTION[value] === undefined) {
    throw new Error(`Unknown leaf type ${value}`)
  }
  return (value: any)
}
