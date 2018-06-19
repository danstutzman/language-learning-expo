import type { GlossRow } from './GlossRow'

export interface LeafCard {
  cardId: number,
  getGlossRow(): GlossRow,
  getQuizQuestion(): string,
}