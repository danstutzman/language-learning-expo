export type Number = 1 | 2

export const NUMBER_TO_DESCRIPTION: {[string]: string} = {
  '1': 'Singular',
  '2': 'Plural',
}

export function assertNumber(value: any): Number {
  if (value !== 1 && value !== 2) {
    throw new Error(`Unknown verb number ${value}`)
  }
  return (value: any)
}
