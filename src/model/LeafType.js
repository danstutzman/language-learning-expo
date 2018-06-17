export const LEAF_TYPE_TO_DESCRIPTION = {
  'Det': 'Determiner',
  'Inf': 'Infinitive',
  'N': 'Noun',
}

export const ALL_FIELDS = ['es', 'en', 'gender']

export const LEAF_TYPE_TO_FIELDS = {
  Det: { gender: true },
  Inf: { },
  N: { gender: true },
}
