import { SQLite } from 'expo'

import type { Card } from './Card'
import seedCards from './seedCards'

const RESEED_CARDS_TABLE = false

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
        tx.executeSql(
          `SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name=?;`,
          ['cards'],
          (tx, { rows: { _array } }) => {
            const exists = (_array[0]['COUNT(*)'] == 1)
            if (exists) {
              if (RESEED_CARDS_TABLE) {
                tx.executeSql(`DROP TABLE cards`, [], () =>
                  tx.executeSql(`CREATE TABLE cards (
                    cardId INTEGER PRIMARY KEY NOT NULL,
                    en TEXT NOT NULL,
                    es TEXT NOT NULL,
                    gender TEXT NOT NULL,
                    mnemonic TEXT NOT NULL,
                    type TEXT NOT NULL
                  );`, [], () => this.seedCardsTable(tx).then(resolve)))
              } else {
                resolve()
              }
            } else {
              tx.executeSql(`CREATE TABLE cards (
                cardId INTEGER PRIMARY KEY NOT NULL,
                en TEXT NOT NULL,
                es TEXT NOT NULL,
                gender TEXT NOT NULL,
                mnemonic TEXT NOT NULL,
                type TEXT NOT NULL
              );`, [], () => this.seedCardsTable(tx).then(resolve))
            }
          })
      }, 
      (e: Error) => reject(e))
    })
  }

  seedCardsTable = (tx: any): Promise<void> => {
    return new Promise(resolve => {
      let sql = `INSERT INTO cards
        (cardId, en, es, gender, mnemonic, type)
        VALUES `
      const values = []
      for (let i = 0; i < seedCards.length; i++) {
        const card = seedCards[i]
        if (i > 0) {
          sql += ', '
        }
        sql += '(?, ?, ?, ?, ?, ?)'
        values.push(card.cardId)
        values.push(card.en)
        values.push(card.es)
        values.push(card.gender)
        values.push(card.mnemonic)
        values.push(card.type)
      }
      sql += ';'
      tx.executeSql(sql, values, resolve)
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