import type { Card } from '../Card'
import type { GlossRow } from '../GlossRow'
import type { InfCategory } from '../enums/InfCategory'
import type { LeafCard } from '../LeafCard'

export function assertInf(value: any): Inf {
  if (typeof value !== 'object' ||
    value.constructor.name !== 'Inf') {
    throw new Error(`Expected Inf but got ${JSON.stringify(value)}`)
  }
  return value
}

export default class Inf implements Card, LeafCard {
  cardId: number
  es: string
  enPresent: string
  enPast: string
  infCategory: InfCategory

  constructor(
    cardId: number,
    es: string,
    enPresent: string,
    enPast: string,
    infCategory: InfCategory
  ) {
    this.cardId = cardId
    this.es = es
    this.enPresent = enPresent
    this.enPast = enPast
    this.infCategory = infCategory
  }

  getContentJson(): string {
    return JSON.stringify({
      es: this.es,
      enPresent: this.enPresent,
      enPast: this.enPast,
      infCategory: this.infCategory,
    })
  }

  getExport(): {} {
    return {
      type: 'Inf',
      es: this.es,
      enPresent: this.enPresent,
      enPast: this.enPast,
      infCategory: this.infCategory,
    }
  }

  getGlossRow(): GlossRow {
    const { cardId, enPresent, es } = this
    return { cardId, en: enPresent, es }
  }

  getGlossRows(): Array<GlossRow> {
    return [this.getGlossRow()]
  }

  getKey(): string {
    return this.es
  }

  getQuizQuestion(): string {
    return `to ${this.enPresent}`
  }
}