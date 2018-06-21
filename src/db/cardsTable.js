import type { Card } from '../cards/Card'

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
          childrenCardIdsJson TEXT NOT NULL,
          glossRowsJson TEXT NOT NULL,
          esWordsJson TEXT NOT NULL,
          quizQuestion TEXT NOT NULL
        )`,
        [],
        () => resolve()
      ),
      (e: Error) => reject(`Error from CREATE TABLE cards: ${e.message}`)
    )
  })
}

export function insertRows(db: any, cards: Array<Card>): Promise<Array<Card>> {
  return new Promise((resolve, reject) =>
    db.transaction(
      tx => {
        if (cards.length === 0) { return resolve() }

        let sql = `INSERT INTO cards
            (cardId,
            type,
            childrenCardIdsJson,
            glossRowsJson,
            esWordsJson,
            quizQuestion)
          VALUES `
        const values = []
        for (let i = 0; i < cards.length; i++) {
          const card: Card = cards[i]

          if (i > 0) {
            sql += ', '
          }
          sql += '(?,?,?,?,?,?)'
          values.push(card.cardId)
          values.push(card.type)
          values.push(JSON.stringify(card.childrenCardIds))
          values.push(JSON.stringify(card.glossRows))
          values.push(JSON.stringify(card.esWords))
          values.push(card.quizQuestion)
        }
        tx.executeSql(sql, values, () => resolve())
      },
      (e: Error) => reject(`Error from INSERT INTO cards: ${e.message}`)
    )
  )
}

export function selectAll(db: any): Promise<Array<Card>> {
  return new Promise((resolve, reject) =>
    db.transaction(
      tx => tx.executeSql(
        `SELECT cardId,
            type,
            childrenCardIdsJson,
            glossRowsJson,
            esWordsJson,
            quizQuestion
          FROM cards
          ORDER BY cardId`,
        [],
        (tx, { rows: { _array } }) => resolve(_array.map(row => ({
          cardId: row.cardId,
          type: row.type,
          childrenCardIds: JSON.parse(row.childrenCardIdsJson),
          glossRows: JSON.parse(row.glossRowsJson),
          esWords: JSON.parse(row.esWordsJson),
          quizQuestion: row.quizQuestion,
        })))
      ),
      (e: Error) => reject(`Error from SELECT FROM cards: ${e.message}`)
    )
  )
}

export function drop(db: any): Promise<void> {
  return new Promise((resolve, reject) =>
    db.transaction(
      tx => tx.executeSql(`DROP TABLE IF EXISTS cards`, [], () => resolve()),
      (e: Error) => reject(`Error from DROP TABLE cards: ${e.message}`)
    )
  )
}