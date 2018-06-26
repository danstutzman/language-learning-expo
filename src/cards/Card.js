import type { GlossRow } from './GlossRow'

export type Card = {|
  glossRows: Array<GlossRow>,
  lastSeenAt: number | null,
  leafIdsCsv: string,
  mnemonic: string,
  prompt: string,
  stage: number,
|}