import type { GlossRow } from './GlossRow'

export interface Card {
  cardId: number,
  getChildren(): Array<Card>,
  getContentJson(): string,
  getExport(): {},
  getKey(): string,
  getGlossRows(): Array<GlossRow>,
  getQuizQuestion(): string,
}