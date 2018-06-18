import type { Card } from '../Card'
import Inf from './Inf'
import RegVPattern from './RegVPattern'

function assertNonZero(value: number): number {
  if (value === 0) {
    throw new Error(`Expected non-zero but got ${value}`)
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

  getContentJson(): string {
    return JSON.stringify({
      inf: assertNonZero(this.inf.cardId),
      pattern: assertNonZero(this.pattern.cardId),
    })
  }

  getExport(): {} {
    return {
      type: 'RegV',
      infKey: this.inf.getKey(),
      patternKey: this.pattern.getKey(),
    }
  }

  getLeafs(): Array<any> {
    return [this.inf, this.pattern]
  }
}