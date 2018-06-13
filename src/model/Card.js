import type { CardGender } from './CardGender'

export const BLANK_CARD: Card = {
  cardId: 0,
  gender: '',
  en: '',
  es: '',
  mnemonic: '',
  type: '',
}

export type Card = {|
  cardId: number,
  en: string,
  es: string,
  gender: string,
  type: string,
  mnemonic: string,
|}
