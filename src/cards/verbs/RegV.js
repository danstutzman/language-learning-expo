import assertNonZero from '../assertNonZero'
import type { Card } from '../Card'
import type { GlossRow } from '../GlossRow'
import Inf from './Inf'
import RegVPattern from './RegVPattern'

const NUMBER_AND_PERSON_TO_EN_VERB_SUFFIX = {
  '11' : '',
  '12' : '',
  '13' : 's',
  '21' : '',
  '23' : '',
}

export function assertRegV(value: any): RegV {
  if (typeof value !== 'object' ||
    value.constructor.name !== 'RegV') {
    throw new Error(`Expected RegV but got ${JSON.stringify(value)}`)
  }
  return value
}

export default class RegV implements Card {
  cardId: number
  inf: Inf
  pattern: RegVPattern

  constructor(cardId: number, inf: Inf, pattern: RegVPattern) {
    this.cardId = cardId
    this.inf = inf
    this.pattern = pattern
  }

  getChildren(): Array<Card> {
    return [this.inf, this.pattern]
  }

  getContentJson(): string {
    return JSON.stringify({
      inf: assertNonZero(this.inf.cardId),
      pattern: assertNonZero(this.pattern.cardId),
    })
  }

  getEsWords(): Array<string> {
    const infEs = this.inf.es
    const patternEs = this.pattern.es
    return [infEs.substring(0, infEs.length - 2) + patternEs.substring(1)]
  }

  getEnVerb(): string {
    if (this.pattern.tense === 'PRES') {
      const suffix = NUMBER_AND_PERSON_TO_EN_VERB_SUFFIX[
        `${this.pattern.number}${this.pattern.person}`]
      if (suffix === undefined) {
        throw new Error(`Unknown suffix for ${JSON.stringify(this)}`)
      }
      return `${this.inf.enPresent}${suffix}`
    } else if (this.pattern.tense === 'PRET') {
      return this.inf.enPast
    } else {
      throw new Error(`Don't know enVerb for tense ${this.pattern.tense}`)
    }
  }

  getExport(): {} {
    return {
      type: 'RegV',
      infKey: this.inf.getKey(),
      patternKey: this.pattern.getKey(),
    }
  }

  getKey(): string {
    return `${this.inf.getKey()}${this.pattern.getKey()}`
  }

  getGlossRows(): Array<GlossRow> {
    return [
      {
        cardId: this.inf.cardId,
        en: this.getEnVerb(),
        es: this.inf.es.substring(0, this.inf.es.length - 2) + '-',
      },
      this.pattern.getGlossRow(),
    ]
  }

  getQuizQuestion(): string {
    return `(${this.pattern.getEnPronoun()}) ${this.getEnVerb()}`
  }
}