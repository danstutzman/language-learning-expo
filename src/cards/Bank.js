import { assertCardType } from './enums/CardType'
import { assertInf } from '../cards/verbs/Inf'
import { assertInfCategory } from './enums/InfCategory'
import { assertNumber } from './enums/Number'
import { assertPerson } from './enums/Person'
import { assertRegVPattern } from '../cards/verbs/RegVPattern'
import { assertTense } from './enums/Tense'
import type { Card } from './Card'
import type { CardRow } from '../db/cardsTable'
import * as cardsTable from '../db/cardsTable'
import hydrateCardSeeds from './hydrateCardSeeds'
import Inf from '../cards/verbs/Inf'
import RegV from '../cards/verbs/RegV'
import RegVPattern from '../cards/verbs/RegVPattern'

function assertString(value: any): string {
  if (typeof value !== 'string') {
    throw new Error(`Unexpected non-string ${JSON.stringify(value)}`)
  }
  return value
}

function rowToCard(row: CardRow, cardByCardId: {[number]: Card}): Card {
  const content = JSON.parse(row.contentJson)
  if (row.type === 'Inf') {
    return new Inf(
      row.cardId,
      assertString(content.es),
      assertString(content.en),
      assertInfCategory(content.infCategory))
  } else if (row.type === 'RegV') {
    return new RegV(
      row.cardId,
      assertInf(cardByCardId[content.inf]),
      assertRegVPattern(cardByCardId[content.pattern]))
  } else if (row.type === 'RegVPattern') {
    return new RegVPattern(
      row.cardId,
      assertString(content.es),
      assertInfCategory(content.infCategory),
      assertNumber(content.number),
      assertPerson(content.person),
      assertTense(content.tense))
  } else {
    throw new Error(`Unknown card type ${row.type}`)
  }
}

export function cardToRow(card: Card): CardRow {
  return {
    cardId: card.cardId,
    type: assertCardType(card.constructor.name),
    contentJson: card.getContentJson(),
  }
}

export default class Bank {
  cardByCardId: {[number]: Card}
  db: any

  constructor(db: any) {
    this.db = db
  }

  init = (): Promise<void> =>
    this._initCardsTable()
      .then(this._loadFromTables)

  _initCardsTable = (): Promise<void> =>
    cardsTable.checkExists(this.db)
      .then((exists: boolean) => {
        if (!exists) {
          return cardsTable.create(this.db)
            .then(() => {
              cardsTable.insertRows(this.db,
                hydrateCardSeeds().map(card => cardToRow(card)))
            })
        }
      })

  _loadFromTables = (): Promise<void> =>
    cardsTable.selectAll(this.db)
      .then((rows: Array<CardRow>) => {
        this.cardByCardId = {}
        for (const row of rows) {
          this.cardByCardId[row.cardId] = rowToCard(row, this.cardByCardId)
        }
      })

  // addCard = (card: Card): Promise<void> =>
  //   cardsTable.insertRow(this.db, card)
  //     .then(card => this.cardByCardId[card.cardId] = card)

  // deleteCard = (card: Card): Promise<void> =>
  //   cardsTable.deleteRow(this.db, card)
  //     .then(() => delete this.cardByCardId[card.cardId])

  // editCard = (card: Card): Promise<void> =>
  //   cardsTable.updateRow(this.db, card)
  //     .then(() => this.cardByCardId[card.cardId] = card)

  exportCards = (): string => {
    const cards: Array<Card> = (Object.values(this.cardByCardId): any)
    const cardsJson = JSON.stringify(cards.map(card => card.getExport()))
      .replace(/,{"type"/g, ',\n{"type"')

    return `Paste in src/cards/hydrateCardSeeds.js:\n\n${cardsJson}`
  }

  reseedDatabase = (): Promise<void> =>
    cardsTable.drop(this.db)
      .then(() => cardsTable.create(this.db))
      .then(() => cardsTable.insertRows(this.db,
        hydrateCardSeeds().map(card => cardToRow(card))))
      .then(this._loadFromTables)
}