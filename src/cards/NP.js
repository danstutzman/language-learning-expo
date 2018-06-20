import type { Card } from './Card'
import type { GlossRow } from './GlossRow'
import type { LeafCard } from './LeafCard'

export default class NP implements Card, LeafCard {
  cardId: number
  es: string
  en: string

  constructor(
    cardId: number,
    es: string,
    en: string,
  ) {
    this.cardId = cardId
    this.es = es
    this.en = en
  }

  getChildren(): Array<Card> {
    return []
  }

  getContentJson(): string {
    return JSON.stringify({
      es: this.es,
      en: this.en,
    })
  }

  getEsWords(): Array<string> {
    return [this.es]
  }

  getExport(): {} {
    return {
      type: 'NP',
      es: this.es,
      en: this.en,
    }
  }

  getGlossRow(): GlossRow {
    const { cardId, en, es } = this
    return { cardId, en, es }
  }

  getGlossRows(): Array<GlossRow> {
    return [this.getGlossRow()]
  }

  getKey(): string {
    return this.es
  }

  getQuizQuestion(): string {
    return this.en
  }
}