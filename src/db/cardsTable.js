import type { Card } from '../cards/Card'
import type { CardUpdate } from '../cards/CardUpdate'

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
          glossRowsJson TEXT NOT NULL,
          lastSeenAt INTEGER,
          leafIdsCsv TEXT NOT NULL,
          mnemonic TEXT NOT NULL,
          prompt TEXT NOT NULL,
          stage INTEGER NOT NULL
        )`,
        [],
        () => resolve()
      ),
      (e: Error) => reject(`Error from CREATE TABLE cards: ${e.message}`)
    )
  })
}

export function insert(db: any, cards: Array<Card>): Promise<void> {
  return new Promise((resolve, reject) =>
    db.transaction(
      tx => {
        if (cards.length === 0) { return resolve() }

        let sql = `INSERT INTO cards
            (cardId,
            glossRowsJson,
            lastSeenAt,
            leafIdsCsv,
            mnemonic,
            prompt,
            stage)
          VALUES `
        const values = []
        for (let i = 0; i < cards.length; i++) {
          const card: Card = cards[i]

          if (i > 0) {
            sql += ', '
          }
          sql += '(?,?,?,?,?,?,?)'
          values.push(card.cardId)
          values.push(JSON.stringify(card.glossRows))
          values.push(card.lastSeenAt)
          values.push(card.leafIdsCsv)
          values.push(card.mnemonic)
          values.push(card.prompt)
          values.push(card.stage)
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
            glossRowsJson,
            lastSeenAt,
            leafIdsCsv,
            mnemonic,
            prompt,
            stage
          FROM cards`,
        [],
        (tx, { rows: { _array } }) => resolve(_array.map(row => ({
          cardId: row.cardId,
          glossRows: JSON.parse(row.glossRowsJson),
          lastSeenAt: row.lastSeenAt,
          leafIdsCsv: row.leafIdsCsv,
          mnemonic: row.mnemonic,
          prompt: row.prompt,
          stage: row.stage,
        })))
      ),
      (e: Error) => reject(`Error from SELECT FROM cards: ${e.message}`)
    )
  )
}

function updateCard(tx: any, cardUpdate: CardUpdate): Promise<void> {
  return new Promise((resolve) => {
    const fields = []
    const values = []
    if (cardUpdate.mnemonic !== undefined) {
      fields.push('mnemonic=?')
      values.push(cardUpdate.mnemonic)
    }
    if (cardUpdate.lastSeenAt !== undefined) {
      fields.push('lastSeenAt=?')
      values.push(cardUpdate.lastSeenAt)
    }
    if (cardUpdate.stage !== undefined) {
      fields.push('stage=?')
      values.push(cardUpdate.stage)
    }
    values.push(cardUpdate.cardId)

    tx.executeSql(
      `UPDATE cards SET ${fields.join(',')} WHERE cardId=?`,
      values,
      (tx, { rows: { _array } }) => resolve(_array)
    )
  })
}

export function updateCards(db: any, cardUpdates: Array<CardUpdate>):
  Promise<void> {
  return new Promise((resolve, reject) => db.transaction(
    tx => {
      const promises =
        cardUpdates.map(cardUpdate => updateCard(tx, cardUpdate))
      Promise.all(promises).then(() => resolve())
    },
    (e: Error) => reject(`Error from UPDATE cards: ${e.message}`)
  ))
}

export function drop(db: any): Promise<void> {
  return new Promise((resolve, reject) =>
    db.transaction(
      tx => tx.executeSql(`DROP TABLE IF EXISTS cards`, [], () => resolve()),
      (e: Error) => reject(`Error from DROP TABLE cards: ${e.message}`)
    )
  )
}