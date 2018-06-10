import { SQLite } from 'expo'

import type { Noun } from './Noun'

export default class DbModel {
  createNounsTable: Promise<void>
  db: any

  constructor() {
    this.db = SQLite.openDatabase('db.db')
    this.createNounsTable = this.initDb()
  }

  initDb(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(`CREATE TABLE IF NOT EXISTS nouns (
          id INTEGER PRIMARY KEY NOT NULL,
          en TEXT,
          es TEXT);
        `)
        resolve()
      }, 
      (e: Error) => reject(e))
    })
  }

  addNoun(): Promise<Array<Noun>> {
    return new Promise((resolve, reject) =>
      this.createNounsTable.then(() => {
        this.db.transaction(tx => {
          tx.executeSql(
            'INSERT INTO nouns (en, es) VALUES (?, ?);',
            ['envalue', 'esvalue'])
          tx.executeSql(
            'SELECT id, en, es FROM nouns',
            [],
            (tx, { rows: { _array } }) => resolve(_array))
        },
        (e: Error) => reject(e))
      })
    )
  }

  loadNouns(): Promise<Array<Noun>> {
    return new Promise((resolve, reject) =>
      this.createNounsTable.then(() => {
        this.db.transaction(tx =>
          tx.executeSql(
            'SELECT id, en, es FROM nouns',
            [],
            (tx, { rows: { _array } }) => resolve(_array)),
        (e: Error) => reject(e))
      })
    )
  }
}