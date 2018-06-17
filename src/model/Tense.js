export type Tense = 'PRES' | 'PRET'

export const TENSE_TO_DESCRIPTION: {[Tense]: string} = {
  PRES: 'Present',
  PRET: 'Preterite',
}

export function assertTense(value: any): Tense {
  if (TENSE_TO_DESCRIPTION[value] === undefined) {
    throw new Error(`Unknown tense ${value}`)
  }
  return (value: any)
}
