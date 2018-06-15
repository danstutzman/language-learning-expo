import type { Card } from './Card'
import type { Db } from './Db'
import type { Exposure } from './Exposure'
import type { ExposureExport } from './exposuresExport'
import exposuresExport from './exposuresExport'

export function checkExists(db: Db): Promise<boolean> {
  return new Promise((resolve, reject) =>
    db.transaction(
      tx => tx.executeSql(
        `SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name=?;`,
        ['exposures'],
        (tx, { rows: { _array } }) => resolve(_array[0]['COUNT(*)'] === 1)
      ),
      (e: Error) => reject(e)
    )
  )
}

export function create(db: Db): Promise<void> {
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => tx.executeSql(
        `CREATE TABLE exposures (
          exposureId INTEGER PRIMARY KEY NOT NULL,
          cardId INTEGER NOT NULL,
          remembered BOOLEAN NOT NULL,
          createdAtSeconds REAL NOT NULL
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
      tx => tx.executeSql(`DROP TABLE exposures`, [], () => resolve()),
      (e: Error) => reject(e)
    )
  )
}

// Returns Promise with Exposure with exposureId set
export function insertRow(db: Db, exposure: Exposure): Promise<Exposure> {
  return new Promise((resolve, reject) =>
    db.transaction(
      tx => tx.executeSql(
        `INSERT INTO exposures (cardId, remembered, createdAtSeconds)
        VALUES (?, ?, ?);`,
        [exposure.cardId, exposure.remembered, exposure.createdAtSeconds],
        (tx: any, result: any) =>
          resolve({ ...exposure, exposureId: result.insertId })
      ),
      (e: Error) => reject(e)
    )
  )
}

export function selectAll(db: Db): Promise<Array<Exposure>> {
  return new Promise((resolve, reject) =>
    db.transaction(
      tx => tx.executeSql(
        `SELECT exposureId, cardId, remembered, createdAtSeconds
          FROM exposures`,
        [],
        (tx, { rows: { _array } }) => {
          for (const row of _array) {
            row.remembered = (row.remembered === 1)
          }
          resolve(_array)
        }
      ),
      (e: Error) => reject(e)
    )
  )
}

export function seed(db: Db, allCards: Array<Card>): Promise<void> {
  return new Promise((resolve, reject) =>
    db.transaction(
      tx => {
        if (exposuresExport.length === 0) { return resolve() }

        const cardByEs: {[string]: Card} = {}
        for (const card of allCards) {
          if (cardByEs[card.es] !== undefined) {
            return reject(`Multiple cards for es=${card.es}`)
          }
          cardByEs[card.es] = card
        }

        let sql = `INSERT INTO exposures
          (cardId, remembered, createdAtSeconds)
          VALUES `
        const values = []
        for (let i = 0; i < exposuresExport.length; i++) {
          const export_: ExposureExport = exposuresExport[i]
          const card = cardByEs[export_.cardEs]
          if (card === undefined) {
            return reject(`Can't find card for es=${export_.cardEs}`)
          }

          if (i > 0) {
            sql += ', '
          }
          sql += '(?, ?, ?)'
          values.push(card.cardId)
          values.push(export_.remembered ? 1 : 0)
          values.push(export_.createdAtSeconds)
        }
        sql += ';'
        tx.executeSql(sql, values, () => resolve())
      },
      (e: Error) => reject(e)
    )
  )
}

