export type CardType = 'Inf' | 'RegV' | 'RegVPattern'

export function assertCardType(value: any): CardType {
  if (value !== 'Inf' && value !== 'RegV' && value !== 'RegVPattern') {
    throw new Error(`Unexpected cardType ${value}`)
  }
  return value
}