export type InfCategory = 'AR' | 'ERIR' | 'ER' | 'IR' | 'STEMPRET'

export const INF_CATEGORY_TO_DESCRIPTION: {[InfCategory]: string} = {
  AR: '-ar verb',
  ERIR: '-er or -ir verb',
  ER: '-er verb',
  IR: '-ir verb',
  STEMPRET: 'stem-changing preterite',
}

export function assertInfCategory(value: any): InfCategory {
  if (INF_CATEGORY_TO_DESCRIPTION[value] === undefined) {
    throw new Error(`Unknown infCategory ${value}`)
  }
  return (value: any)
}