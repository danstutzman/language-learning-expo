import type { Card } from '../Card'
import type { InfCategory } from '../../enums/InfCategory'
import type { Number } from '../../enums/Number'
import type { Person } from '../../enums/Person'
import type { Tense } from '../../enums/Tense'

export function assertRegVPattern(value: any): RegVPattern {
  if (typeof value !== 'object' ||
    value.constructor.name !== 'RegVPattern') {
    throw new Error(`Expected RegVPattern but got ${JSON.stringify(value)}`)
  }
  return value
}

export default class RegVPattern implements Card {
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

  getKey(): string {
    return `${this.infCategory}${this.number}${this.person}${this.tense}`
  }
}