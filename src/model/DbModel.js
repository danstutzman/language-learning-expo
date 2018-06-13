import { SQLite } from 'expo'

import type { Card } from './Card'
import * as cardsTable from './cardsTable'

const RESEED_CARDS_TABLE = false

export default class DbModel {
  db: any

  constructor() {
    this.db = SQLite.openDatabase('db.db')
  }

  initDb = (): Promise<void> =>
    cardsTable.checkExists(this.db)
      .then((exists: boolean) => {
        if (exists) {
          if (RESEED_CARDS_TABLE) {
            return cardsTable.drop(this.db)
              .then(() => cardsTable.create(this.db))
              .then(() => cardsTable.seed(this.db))
          }
        } else {
          return cardsTable.create(this.db)
            .then(() => cardsTable.seed(this.db))
        }
      })

  addCard = (card: Card): Promise<void> =>
    cardsTable.insertRow(this.db, card)

  deleteCard = (card: Card): Promise<void> =>
    cardsTable.deleteRow(this.db, card)

  editCard = (card: Card): Promise<void> =>
    cardsTable.updateRow(this.db, card)

  loadCards = (): Promise<Array<Card>> =>
    cardsTable.selectAll(this.db)
}