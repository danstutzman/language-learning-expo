import type { CardType } from '../enums/CardType'

export type CardRow = {|
  cardId: number,
  type: CardType,
  contentJson: string,
|}

export function checkExists(db: any): Promise<boolean> {
  return new Promise((resolve, reject) =>
    db.transaction(
      tx => tx.executeSql(
        `SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name=?;`,
        ['cards'],
        (tx, { rows: { _array } }) => resolve(_array[0]['COUNT(*)'] === 1)
      ),
      (e: Error) => reject(`Error from check exists cards: ${e.message}`)
    )
  )
}

export function create(db: any): Promise<void> {
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => tx.executeSql(
        `CREATE TABLE cards (
          cardId INTEGER PRIMARY KEY NOT NULL,
          type TEXT NOT NULL,
          contentJson TEXT NOT NULL
        )`,
        [],
        () => resolve()
      ),
      (e: Error) => reject(`Error from CREATE TABLE leafs: ${e.message}`)
    )
  })
}

export function insertRows(
  db: any,
  cardRows: Array<CardRow>
): Promise<Array<CardRow>> {
  return new Promise((resolve, reject) =>
    db.transaction(
      tx => {
        if (cardRows.length === 0) { return resolve() }

        let sql = `INSERT INTO cards
          (type, contentJson)
          VALUES `
        const values = []
        for (let i = 0; i < cardRows.length; i++) {
          const cardRow: CardRow = cardRows[i]

          if (i > 0) {
            sql += ', '
          }
          sql += '(?,?)'
          values.push(cardRow.type)
          values.push(cardRow.contentJson)
        }
        tx.executeSql(sql, values, (tx: any, result: any) => {
          let cardId = result.insertId - cardRows.length + 1
          for (const cardRow of cardRows) {
            cardRow.cardId = cardId
            cardId += 1
          }
          resolve(cardRows)
        })
      },
      (e: Error) => reject(`Error from INSERT INTO cards: ${e.message}`)
    )
  )
}

export function selectAll(db: any): Promise<Array<CardRow>> {
  return new Promise((resolve, reject) =>
    db.transaction(
      tx => tx.executeSql(
        `SELECT cardId, type, contentJson FROM cards ORDER BY cardId`,
        [],
        (tx, { rows: { _array } }) => resolve(_array)
      ),
      (e: Error) => reject(`Error from SELECT FROM exposures: ${e.message}`)
    )
  )
}

export function drop(db: any): Promise<void> {
  return new Promise((resolve, reject) =>
    db.transaction(
      tx => tx.executeSql(`DROP TABLE cards`, [], () => resolve()),
      (e: Error) => reject(`Error from DROP TABLE cards: ${e.message}`)
    )
  )
}