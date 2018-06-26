import type { GlossRow } from './GlossRow'

export type Card = {|
  cardId: number,
  glossRows: Array<GlossRow>,
  lastSeenAt: number | null,
  leafIdsCsv: string,
  mnemonic: string,
  prompt: string,
  stage: number,
|}