import type { GlossRow } from './GlossRow'

export type Card = {|
  cardId: number,
  type: string,
  key: string, // for exporting; TODO move this to server
  childrenCardIds: Array<number>,
  esWords: Array<string>,
  glossRows: Array<GlossRow>,
  quizQuestion: string,
|}