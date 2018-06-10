import { SQLite } from 'expo'

import type { Noun } from './Noun'

export default class DbModel {
  createNounsTable: Promise<void>
  db: any

  constructor() {
    this.db = SQLite.openDatabase('db.db')
    this.createNounsTable = this.initDb()
  }

  initDb = (): Promise<void> => {
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

  addNoun = (noun: Noun): Promise<Array<Noun>> => {
    return new Promise((resolve, reject) =>
      this.createNounsTable.then(() => {
        this.db.transaction(tx =>
          tx.executeSql(
            'INSERT INTO nouns (en, es) VALUES (?, ?);',
            [noun.en, noun.es]),
        (e: Error) => reject(e))
      }).then(this.loadNouns)
        .then(nouns => resolve(nouns))
    )
  }

  editNoun = (noun: Noun): Promise<Array<Noun>> => {
    return new Promise((resolve, reject) =>
      this.createNounsTable.then(() => {
        this.db.transaction(tx =>
          tx.executeSql(
            'UPDATE nouns SET en=?, es=? WHERE ID=?;',
            [noun.en, noun.es, noun.id]),
        (e: Error) => reject(e))
      }).then(this.loadNouns)
        .then(nouns => resolve(nouns))
    )
  }

  loadNouns = (): Promise<Array<Noun>> => {
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