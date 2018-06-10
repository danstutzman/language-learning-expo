import { SQLite } from 'expo'

import type { Item } from './Item'

export default class DbModel {
  db: any

  constructor() {
    this.db = SQLite.openDatabase('db.db')
  }

  initDb() {
    this.db.transaction(tx => {
      tx.executeSql('create table if not exists items (id integer primary key not null, done int, value text);')
    })
  }

  addItem(): Promise<Array<Item>> {
    return new Promise((resolve, reject) =>
      this.db.transaction(tx => {
        tx.executeSql(
          'insert into items (done, value) values (0, ?)',
          ['text'])
        tx.executeSql(
          'select * from items',
          [],
          (tx, { rows: { _array } }) => resolve(_array))
      },
      (e: Error) => reject(e))
    )
  }

  loadItems(): Promise<Array<Item>> {
    return new Promise((resolve, reject) =>
      this.db.transaction(tx =>
        tx.executeSql(
          'select * from items',
          [],
          (tx, { rows: { _array } }) => resolve(_array)),
      (e: Error) => reject(e))
    )
  }
}