import type { LeafCard } from './LeafCard'

export interface Card {
  cardId: number,
  getContentJson(): string,
  getExport(): {},
  getKey(): string,
  getLeafCards(): Array<LeafCard>,
}