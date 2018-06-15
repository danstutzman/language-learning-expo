import type { Leaf } from './Leaf'
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
          leafId INTEGER NOT NULL,
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
        `INSERT INTO exposures (leafId, remembered, createdAtSeconds)
        VALUES (?, ?, ?);`,
        [exposure.leafId, exposure.remembered, exposure.createdAtSeconds],
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
        `SELECT exposureId, leafId, remembered, createdAtSeconds
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

export function seed(db: Db, allLeafs: Array<Leaf>): Promise<void> {
  return new Promise((resolve, reject) =>
    db.transaction(
      tx => {
        if (exposuresExport.length === 0) { return resolve() }

        const leafByEs: {[string]: Leaf} = {}
        for (const leaf of allLeafs) {
          if (leafByEs[leaf.es] !== undefined) {
            return reject(`Multiple leafs for es=${leaf.es}`)
          }
          leafByEs[leaf.es] = leaf
        }

        let sql = `INSERT INTO exposures
          (leafId, remembered, createdAtSeconds)
          VALUES `
        const values = []
        for (let i = 0; i < exposuresExport.length; i++) {
          const export_: ExposureExport = exposuresExport[i]
          const leaf = leafByEs[export_.leafEs]
          if (leaf === undefined) {
            return reject(`Can't find leaf for es=${export_.leafEs}`)
          }

          if (i > 0) {
            sql += ', '
          }
          sql += '(?, ?, ?)'
          values.push(leaf.leafId)
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

