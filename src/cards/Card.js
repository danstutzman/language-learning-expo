import type { GlossRow } from './GlossRow'

export type Card = {|
  cardId: number,
  type: string,
  childrenCardIds: Array<number>,
  esWords: Array<string>,
  glossRows: Array<GlossRow>,
  quizQuestion: string,
|}