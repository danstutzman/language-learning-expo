import { assertExposureType } from './ExposureType'
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
      (e: Error) => reject(`Error from check exists exposures: ${e.message}`)
    )
  )
}

export function create(db: Db): Promise<void> {
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => tx.executeSql(
        `CREATE TABLE exposures (
          exposureId INTEGER PRIMARY KEY NOT NULL,
          type TEXT NOT NULL,
          leafIdsCsv TEXT NOT NULL,
          createdAt REAL NOT NULL,
          delay INTEGER
        );`,
        [],
        () => resolve()
      ),
      (e: Error) => reject(`Error from CREATE TABLE exposures: ${e.message}`)
    )
  })
}

export function drop(db: Db): Promise<void> {
  return new Promise((resolve, reject) =>
    db.transaction(
      tx => tx.executeSql(`DROP TABLE exposures`, [], () => resolve()),
      (e: Error) => reject(`Error from DROP TABLE exposures: ${e.message}`)
    )
  )
}

// Returns Promise with Exposures with exposureId set
export function insertRows(
  db: Db,
  exposures: Array<Exposure>
): Promise<Array<Exposure>> {
  return new Promise((resolve, reject) =>
    db.transaction(
      tx => {
        let sql = `INSERT INTO exposures
          (type, leafIdsCsv, createdAt, delay)
          VALUES `
        let values = []
        for (let i = 0; i < exposures.length; i++) {
          const exposure = exposures[i]
          if (i > 0) {
            sql += ', '
          }
          sql += '(?, ?, ?, ?)'
          values.push(exposure.type)
          values.push(exposure.leafIds.join(','))
          values.push(exposure.createdAt)
          values.push(exposure.delay)
        }
        tx.executeSql(
          sql,
          values,
          (tx: any, result: any) => {
            const newExposures: Array<Exposure> = []
            let exposureId = result.insertId - exposures.length + 1
            for (const exposure of exposures) {
              newExposures.push({ ...exposure, exposureId })
              exposureId += 1
            }
            resolve(newExposures)
          }
        )
      },
      (e: Error) => reject(`Error from INSERT INTO exposures: ${e.message}`)
    )
  )
}

export function selectAll(db: Db): Promise<Array<Exposure>> {
  return new Promise((resolve, reject) =>
    db.transaction(
      tx => tx.executeSql(
        `SELECT exposureId, type, leafIdsCsv, createdAt, delay
          FROM exposures`,
        [],
        (tx, { rows: { _array } }) => resolve(_array.map(row => ({
          exposureId: row.exposureId,
          type: assertExposureType(row.type),
          leafIds: row.leafIdsCsv.split(',').map(leafIdString => {
            const leafId = parseInt(leafIdString, 10)
            if (Number.isNaN(leafId)) {
              throw new Error(
                `Can't parse leafId ${JSON.stringify(leafIdString)} ` +
                ` in ${JSON.stringify(row.leafIdsCsv)}`)
            }
            return leafId
          }),
          createdAt: row.createdAt,
          delay: row.delay,
        })))
      ),
      (e: Error) => reject(`Error from SELECT FROM exposures: ${e.message}`)
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
          (type, leafIdsCsv, createdAt, delay)
          VALUES `
        const values = []
        for (let i = 0; i < exposuresExport.length; i++) {
          const export_: ExposureExport = exposuresExport[i]
          const leafIds = export_.leafEss.map(es => {
            const leaf = leafByEs[es]
            if (leaf === undefined) {
              throw new Error(`Can't find leaf for es=${es}`)
            }
            return leaf.leafId
          }).join(',')

          if (i > 0) {
            sql += ', '
          }
          sql += '(?, ?, ?, ?)'
          values.push(export_.type)
          values.push(leafIds)
          values.push(export_.createdAt)
          values.push(export_.delay)
        }
        sql += ';'
        tx.executeSql(sql, values, () => resolve())
      },
      (e: Error) => reject(`Error from INSERT INTO exposures: ${e.message}`)
    )
  )
}
