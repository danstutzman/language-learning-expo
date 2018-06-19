import type { GlossRow } from './GlossRow'

export interface Card {
  cardId: number,
  getContentJson(): string,
  getExport(): {},
  getGlossRows(): Array<GlossRow>,
  getQuizQuestion(): string,
}