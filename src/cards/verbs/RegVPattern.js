import type { Card } from '../Card'
import type { GlossRow } from '../GlossRow'
import type { InfCategory } from '../enums/InfCategory'
import type { LeafCard } from '../LeafCard'
import type { Number } from '../enums/Number'
import type { Person } from '../enums/Person'
import type { Tense } from '../enums/Tense'

export function assertRegVPattern(value: any): RegVPattern {
  if (typeof value !== 'object' ||
    value.constructor.name !== 'RegVPattern') {
    throw new Error(`Expected RegVPattern but got ${JSON.stringify(value)}`)
  }
  return value
}

const NUMBER_AND_PERSON_TO_EN_PRONOUN = {
  '11' : 'I',
  '12' : 'you',
  '13' : 'he/she',
  '21' : 'we',
  '23' : 'they',
}

export default class RegVPattern implements Card, LeafCard {
  cardId: number
  es: string
  infCategory: InfCategory
  number: Number
  person: Person
  tense: Tense

  constructor(
    cardId: number,
    es: string,
    infCategory: InfCategory,
    number: Number,
    person: Person,
    tense: Tense
  ) {
    this.cardId = cardId
    this.es = es
    this.infCategory = infCategory
    this.number = number
    this.person = person
    this.tense = tense
  }

  getChildren(): Array<Card> {
    return []
  }

  getContentJson(): string {
    return JSON.stringify({
      es: this.es,
      infCategory: this.infCategory,
      number: this.number,
      person: this.person,
      tense: this.tense,
    })
  }

  getExport(): {} {
    return {
      type: 'RegVPattern',
      es: this.es,
      infCategory: this.infCategory,
      number: this.number,
      person: this.person,
      tense: this.tense,
    }
  }

  getEnPronoun(): string {
    const enPronoun =
      NUMBER_AND_PERSON_TO_EN_PRONOUN[`${this.number}${this.person}`]
    if (enPronoun === undefined) {
      throw new Error(`Unknown enPronoun for ${JSON.stringify(this)}`)
    }
    return enPronoun
  }

  getGlossRow(): GlossRow {
    return {
      cardId: this.cardId,
      en: `(${this.getEnPronoun()})`,
      es: this.es,
    }
  }

  getGlossRows(): Array<GlossRow> {
    return [this.getGlossRow()]
  }

  getKey(): string {
    return `${this.infCategory}${this.number}${this.person}${this.tense}`
  }

  getLeafCards(): Array<LeafCard> {
    return [this]
  }

  getQuizQuestion(): string {
    return `${this.infCategory} verb suffix for ${
      this.getEnPronoun()} in ${this.tense}`
  }
}