export type CardType = 'Inf' | 'RegV' | 'RegVPattern'

const CARD_TYPES = {
  IClause: true,
  Inf: true,
  RegV: true,
  RegVPattern: true,
}

export function assertCardType(value: any): CardType {
  if (CARD_TYPES[value] === undefined) {
    throw new Error(`Unexpected cardType ${value}`)
  }
  return value
}