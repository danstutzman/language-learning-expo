import type { Card } from '../Card'
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
  en: string
  infCategory: InfCategory

  constructor(
    cardId: number,
    es: string,
    en: string,
    infCategory: InfCategory
  ) {
    this.cardId = cardId
    this.es = es
    this.en = en
    this.infCategory = infCategory
  }

  getContentJson(): string {
    return JSON.stringify({
      es: this.es,
      en: this.en,
      infCategory: this.infCategory,
    })
  }

  getExport(): {} {
    return {
      type: 'Inf',
      es: this.es,
      en: this.en,
      infCategory: this.infCategory,
    }
  }

  getGloss(): string {
    return this.en
  }

  getKey(): string {
    return `${this.es}${this.infCategory}`
  }

  getLeafCards(): Array<LeafCard> {
    return [this]
  }
}