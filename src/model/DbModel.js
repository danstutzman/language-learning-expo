import { SQLite } from 'expo'

import type { Card } from './Card'
import * as cardsTable from './cardsTable'
import type { Exposure } from './Exposure'
import * as exposuresTable from './exposuresTable'

const RESEED_TABLES = false

export default class DbModel {
  db: any

  constructor() {
    this.db = SQLite.openDatabase('db.db')
  }

  initDb = (): Promise<void> =>
    this._initCardsTable().then(this._initExposuresTable)

  _initCardsTable = (): Promise<void> =>
    cardsTable.checkExists(this.db)
      .then((exists: boolean) => {
        if (exists) {
          if (RESEED_TABLES) {
            return cardsTable.drop(this.db)
              .then(() => cardsTable.create(this.db))
              .then(() => cardsTable.seed(this.db))
          }
        } else {
          return cardsTable.create(this.db)
            .then(() => cardsTable.seed(this.db))
        }
      })

  _initExposuresTable = (): Promise<void> =>
    exposuresTable.checkExists(this.db)
      .then((exists: boolean) => {
        if (exists) {
          if (RESEED_TABLES) {
            return exposuresTable.drop(this.db)
              .then(() => exposuresTable.create(this.db))
          }
        } else {
          return exposuresTable.create(this.db)
        }
      })

  addCard = (card: Card): Promise<void> =>
    cardsTable.insertRow(this.db, card)

  deleteCard = (card: Card): Promise<void> =>
    cardsTable.deleteRow(this.db, card)

  editCard = (card: Card): Promise<void> =>
    cardsTable.updateRow(this.db, card)

  loadCards = (): Promise<[Array<Card>, Array<Card>]> => {
    return Promise.all([
      cardsTable.selectAll(this.db),
      exposuresTable.selectAll(this.db),
    ]).then((results: [Array<Card>, Array<Exposure>]) => {
      const allCards = results[0]

      const exposures = results[1]
      const cardIdToLastExposure: {[number]: Exposure} = {}
      for (const exposure of exposures) {
        const lastExposure = cardIdToLastExposure[exposure.cardId]
        if (lastExposure === undefined ||
            exposure.createdAtSeconds > lastExposure.createdAtSeconds) {
          cardIdToLastExposure[exposure.cardId] = exposure
        }
      }

      // Sort non-exposed and earlier-exposed cards first
      const speakCards = allCards.filter((card: Card) => !card.suspended)
      speakCards.sort((c1: Card, c2: Card) => {
        const e1 = cardIdToLastExposure[c1.cardId]
        const e2 = cardIdToLastExposure[c2.cardId]
        if (e1 === undefined) { return -1 }
        if (e2 === undefined) { return 1 }
        return e1.createdAtSeconds < e2.createdAtSeconds ? -1 : 1
      })
      return [allCards, speakCards]
    })
  }

  addExposure = (exposure: Exposure): Promise<void> =>
    exposuresTable.insertRow(this.db, exposure)
}