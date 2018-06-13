import { SQLite } from 'expo'

import type { Card } from './Card'

export default class DbModel {
  createCardsTable: Promise<void>
  db: any

  constructor() {
    this.db = SQLite.openDatabase('db.db')
    this.createCardsTable = this.initDb()
  }

  initDb = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(`CREATE TABLE IF NOT EXISTS cards (
          cardId INTEGER PRIMARY KEY NOT NULL,
          en TEXT NOT NULL,
          es TEXT NOT NULL,
          gender TEXT NOT NULL,
          mnemonic TEXT NOT NULL,
          type TEXT NOT NULL
        );`)
        resolve()
      }, 
      (e: Error) => reject(e))
    })
  }

  addCard = (card: Card): Promise<Array<Card>> => {
    return new Promise((resolve, reject) =>
      this.createCardsTable.then(() => {
        this.db.transaction(tx =>
          tx.executeSql(
            `INSERT INTO cards (en, es, gender, mnemonic, type)
              VALUES (?, ?, ?, ?, ?);`,
            [card.en, card.es, card.gender, card.mnemonic, card.type]),
        (e: Error) => reject(e))
      }).then(this.loadCards)
        .then(cards => resolve(cards))
    )
  }

  deleteCard = (card: Card): Promise<Array<Card>> => {
    return new Promise((resolve, reject) =>
      this.createCardsTable.then(() => {
        this.db.transaction(tx =>
          tx.executeSql(
            'DELETE FROM cards WHERE cardId=?;',
            [card.cardId]),
        (e: Error) => reject(e))
      }).then(this.loadCards)
        .then(cards => resolve(cards))
    )
  }

  editCard = (card: Card): Promise<Array<Card>> => {
    return new Promise((resolve, reject) =>
      this.createCardsTable.then(() => {
        this.db.transaction(tx =>
          tx.executeSql(
            `UPDATE cards SET en=?, es=?, gender=?, mnemonic=?, type=?
              WHERE cardId=?;`,
            [card.en, card.es, card.mnemonic, card.gender, card.type,
              card.cardId]),
        (e: Error) => reject(e))
      }).then(this.loadCards)
        .then(cards => resolve(cards))
    )
  }

  loadCards = (): Promise<Array<Card>> => {
    return new Promise((resolve, reject) =>
      this.createCardsTable.then(() => {
        this.db.transaction(tx =>
          tx.executeSql(
            'SELECT cardId, en, es, gender, mnemonic, type FROM cards',
            [],
            (tx, { rows: { _array } }) => resolve(_array)),
        (e: Error) => reject(e))
      })
    )
  }
}