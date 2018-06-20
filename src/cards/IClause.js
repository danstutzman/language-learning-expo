import assertNonZero from './assertNonZero'
import type { Card } from './Card'
import type { GlossRow } from './GlossRow'
import NP from './NP'
import RegV from './verbs/RegV'

function capitalizeFirstLetter(s: string) {
  return s.substring(0, 1).toUpperCase() + s.substring(1)
}

function capitalizeFirstLetterOfFirstWord(words: Array<string>): Array<string> {
  return [capitalizeFirstLetter(words[0])].concat(words.slice(1))
}

export default class IClause implements Card {
  cardId: number
  agent: NP | null
  v: RegV

  constructor(cardId: number, agent: NP | null, v: RegV) {
    this.cardId = cardId
    this.agent = agent
    this.v = v
  }

  getChildren(): Array<Card> {
    return []
      .concat(this.agent === null ? [] : [this.agent])
      .concat([this.v])
  }

  getContentJson(): string {
    return JSON.stringify({
      agent: (this.agent === null) ? null : assertNonZero(this.agent.cardId),
      v: assertNonZero(this.v.cardId),
    })
  }

  getEsWords(): Array<string> {
    return capitalizeFirstLetterOfFirstWord([]
      .concat(this.agent === null ? [] : this.agent.getEsWords())
      .concat(this.v.getEsWords())
      .concat(['.']))
  }

  getExport(): {} {
    return {
      type: 'IClause',
      agentKey: (this.agent === null) ? null : this.agent.getKey(),
      vKey: this.v.getKey(),
    }
  }

  getKey(): string {
    return 'agent='
      + ((this.agent === null) ? '' : (this.agent : any).getKey())
      + ` v=${this.v.getKey()}`
  }

  getGlossRows(): Array<GlossRow> {
    return []
      .concat(this.agent === null ? [] : this.agent.getGlossRows())
      .concat(this.v.getGlossRows())
  }

  getQuizQuestion(): string {
    return capitalizeFirstLetter([]
      .concat(this.agent === null
        ? ['(' + this.v.pattern.getEnPronoun() + ')']
        : [this.agent.getQuizQuestion()])
      .concat([this.v.getEnVerb()])
      .join(' ')) + '.'
  }
}