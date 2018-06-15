import { SQLite } from 'expo'

import type { Card } from './Card'
import * as cardsTable from './cardsTable'
import type { Exposure } from './Exposure'
import * as exposuresTable from './exposuresTable'
import type { Model } from './Model'

const RESEED_TABLES = false

export default class DbModel {
  db: any
  allCards: Array<Card>
  allExposures: Array<Exposure>

  constructor() {
    this.db = SQLite.openDatabase('db.db')
  }

  init = (): Promise<Model> =>
    this._initCardsTable()
      .then(this._initExposuresTable)
      .then(this._loadFromTables)
      .then(this._recomputeModel)

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

  _loadFromTables = (): Promise<void> => {
    return Promise.all([
      cardsTable.selectAll(this.db),
      exposuresTable.selectAll(this.db),
    ]).then((results: [Array<Card>, Array<Exposure>]) => {
      this.allCards = results[0]
      this.allExposures = results[1]
    })
  }

  // Reads in this.allCards and this.allExposures
  _recomputeModel = (): Model => {
    const cardIdToLastExposure: {[number]: Exposure} = {}
    for (const exposure of this.allExposures) {
      const lastExposure = cardIdToLastExposure[exposure.cardId]
      if (lastExposure === undefined ||
          exposure.createdAtSeconds > lastExposure.createdAtSeconds) {
        cardIdToLastExposure[exposure.cardId] = exposure
      }
    }

    // Sort non-exposed and earlier-exposed cards first
    const speakCards = this.allCards.filter((card: Card) =>
      !card.suspended && card.type === 'EsN')
    speakCards.sort((c1: Card, c2: Card) => {
      const e1 = cardIdToLastExposure[c1.cardId]
      const e2 = cardIdToLastExposure[c2.cardId]
      if (e1 === undefined) { return -1 }
      if (e2 === undefined) { return 1 }
      return e1.createdAtSeconds < e2.createdAtSeconds ? -1 : 1
    })

    const cardIdToCategory: {[number]: string} = {}
    for (const card of this.allCards) {
      const exposure = cardIdToLastExposure[card.cardId]

      let category: string
      if (exposure === undefined) {
        category = 'FIRST_TIME'
      } else {
        if (exposure.remembered) {
          category = 'SUCCEEDED'
        } else {
          category = 'BROKEN'
        }
      }
      cardIdToCategory[card.cardId] = category
    }

    return { allCards: this.allCards, speakCards, cardIdToCategory }
  }

  addCard = (cardWithoutCardId: Card): Promise<Model> =>
    cardsTable.insertRow(this.db, cardWithoutCardId)
      .then((cardWithCardId: Card) => {
        this.allCards.push(cardWithCardId)
        return this._recomputeModel()
      })

  deleteCard = (cardToDelete: Card): Promise<Model> =>
    cardsTable.deleteRow(this.db, cardToDelete)
      .then(() => {
        this.allCards = this.allCards.filter(card =>
          card.cardId !== cardToDelete.cardId)
        return this._recomputeModel()
      })

  editCard = (updatedCard: Card): Promise<Model> =>
    cardsTable.updateRow(this.db, updatedCard)
      .then(() => {
        this.allCards = this.allCards.map(card =>
          card.cardId === updatedCard.cardId ? updatedCard : card)
        return this._recomputeModel()
      })

  addExposure = (exposure: Exposure): Promise<Model> =>
    exposuresTable.insertRow(this.db, exposure)
      .then(() => {
        this.allExposures.push(exposure)
        return this._recomputeModel()
      })
}