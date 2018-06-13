import type { Card } from './Card'
import type { Db } from './Db'
import seedCards from './seedCards'

export function checkExists(db: Db): Promise<boolean> {
  return new Promise((resolve, reject) =>
    db.transaction(
      tx => tx.executeSql(
        `SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name=?;`,
        ['cards'],
        (tx, { rows: { _array } }) => resolve(_array[0]['COUNT(*)'] == 1)
      ),
      (e: Error) => reject(e)
    )
  )
}

export function create(db: Db): Promise<void> {
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => tx.executeSql(
        `CREATE TABLE cards (
          cardId INTEGER PRIMARY KEY NOT NULL,
          en TEXT NOT NULL,
          es TEXT NOT NULL,
          gender TEXT NOT NULL,
          mnemonic TEXT NOT NULL,
          type TEXT NOT NULL
        );`,
        [],
        () => resolve()
      ),
      (e: Error) => reject(e)
    )
  })
}

export function drop(db: Db): Promise<void> {
  return new Promise((resolve, reject) =>
    db.transaction(
      tx => tx.executeSql(`DROP TABLE cards`, [], () => resolve()),
      (e: Error) => reject(e)
    )
  )
}

export function seed(db: Db): Promise<void> {
  return new Promise((resolve, reject) =>
    db.transaction(
      tx => {
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
        tx.executeSql(sql, values, () => resolve())
      },
      (e: Error) => reject(e)
    )
  )
}

export function insertRow(db: Db, card: Card): Promise<void> {
  return new Promise((resolve, reject) =>
    db.transaction(
      tx => tx.executeSql(
        `INSERT INTO cards (en, es, gender, mnemonic, type)
        VALUES (?, ?, ?, ?, ?);`,
        [card.en, card.es, card.gender, card.mnemonic, card.type],
        () => resolve()
      ),
      (e: Error) => reject(e)
    )
  )
}

export function deleteRow(db: Db, card: Card): Promise<void> {
  return new Promise((resolve, reject) =>
    db.transaction(
      tx => tx.executeSql(
        'DELETE FROM cards WHERE cardId=?;',
        [card.cardId],
        () => resolve()
      ),
      (e: Error) => reject(e)
    )
  )
}

export function updateRow(db: Db, card: Card): Promise<void> {
  return new Promise((resolve, reject) =>
    db.transaction(
      tx => tx.executeSql(
        `UPDATE cards SET en=?, es=?, gender=?, mnemonic=?, type=?
          WHERE cardId=?;`,
        [card.en, card.es, card.mnemonic, card.gender, card.type, card.cardId],
        () => resolve()
      ),
      (e: Error) => reject(e)
    )
  )
}

export function selectAll(db: Db): Promise<Array<Card>> {
  return new Promise((resolve, reject) =>
    db.transaction(
      tx => tx.executeSql(
        'SELECT cardId, en, es, gender, mnemonic, type FROM cards',
        [],
        (tx, { rows: { _array } }) => resolve(_array)
      ),
      (e: Error) => reject(e)
    )
  )
}