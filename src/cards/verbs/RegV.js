import type { Card } from '../Card'
import type { GlossRow } from '../GlossRow'
import Inf from './Inf'
import RegVPattern from './RegVPattern'

function assertNonZero(value: number): number {
  if (value === 0) {
    throw new Error(`Expected non-zero but got ${value}`)
  }
  return value
}

const NUMBER_AND_PERSON_TO_EN_VERB_SUFFIX = {
  '11' : '',
  '12' : '',
  '13' : 's',
  '21' : '',
  '23' : '',
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

  getContentJson(): string {
    return JSON.stringify({
      inf: assertNonZero(this.inf.cardId),
      pattern: assertNonZero(this.pattern.cardId),
    })
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

  getKey(): string {
    return `${this.inf.getKey()}${this.pattern.getKey()}`
  }

  getQuizQuestion(): string {
    return `(${this.pattern.getEnPronoun()}) ${this.getEnVerb()}`
  }
}