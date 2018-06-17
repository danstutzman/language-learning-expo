export const BLANK_LEAF: Leaf = {
  leafId: 0,
  gender: '',
  en: '',
  es: '',
  mnemonic: '',
  suspended: false,
  type: 'N',
}

export type Leaf = {|
  type: string,
  leafId: number,
  en: string,
  es: string,
  mnemonic: string,
  suspended: boolean,

  gender?: string,
|}
