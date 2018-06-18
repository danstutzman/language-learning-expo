import type { Card } from './Card'
import * as cardsTable from '../db/cardsTable'

import hydrateCardSeeds from './hydrateCardSeeds'

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
            .then(() => cardsTable.seed(this.db, hydrateCardSeeds()))
        }
      })

  _loadFromTables = (): Promise<void> =>
    Promise.all([
      cardsTable.selectAll(this.db),
    ]).then((results: [{[number]: Card}]) => {
      this.cardByCardId = results[0]
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
      .then(() => cardsTable.seed(this.db, hydrateCardSeeds()))
      .then(() => cardsTable.selectAll(this.db))
      .then(this._loadFromTables)
}