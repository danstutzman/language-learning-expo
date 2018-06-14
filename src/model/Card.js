export const BLANK_CARD: Card = {
  cardId: 0,
  gender: '',
  en: '',
  es: '',
  mnemonic: '',
  suspended: false,
  type: '',
}

export type Card = {|
  cardId: number,
  en: string,
  es: string,
  gender: string,
  mnemonic: string,
  suspended: boolean,
  type: string,
|}
