export const BLANK_LEAF: Leaf = {
  leafId: 0,
  gender: '',
  en: '',
  es: '',
  mnemonic: '',
  suspended: false,
  type: '',
}

export type Leaf = {|
  leafId: number,
  en: string,
  es: string,
  gender: string,
  mnemonic: string,
  suspended: boolean,
  type: string,
|}
