import type { Leaf } from './Leaf'
import type { Db } from './Db'
import seedLeafs from './seedLeafs'

export function checkExists(db: Db): Promise<boolean> {
  return new Promise((resolve, reject) =>
    db.transaction(
      tx => tx.executeSql(
        `SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name=?;`,
        ['leafs'],
        (tx, { rows: { _array } }) => resolve(_array[0]['COUNT(*)'] === 1)
      ),
      (e: Error) => reject(`Error from check exists leafs: ${e.message}`)
    )
  )
}

export function create(db: Db): Promise<void> {
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => tx.executeSql(
        `CREATE TABLE leafs (
          leafId INTEGER PRIMARY KEY NOT NULL,
          en TEXT NOT NULL,
          es TEXT NOT NULL,
          gender TEXT NOT NULL,
          mnemonic TEXT NOT NULL,
          suspended BOOLEAN NOT NULL,
          type TEXT NOT NULL
        );`,
        [],
        () => resolve()
      ),
      (e: Error) => reject(`Error from CREATE TABLE leafs: ${e.message}`)
    )
  })
}

export function drop(db: Db): Promise<void> {
  return new Promise((resolve, reject) =>
    db.transaction(
      tx => tx.executeSql(`DROP TABLE leafs`, [], () => resolve()),
      (e: Error) => reject(`Error from DROP TABLE leafs: ${e.message}`)
    )
  )
}

export function seed(db: Db): Promise<void> {
  return new Promise((resolve, reject) =>
    db.transaction(
      tx => {
        let sql = `INSERT INTO leafs
          (leafId, en, es, gender, mnemonic, suspended, type)
          VALUES `
        const values = []
        for (let i = 0; i < seedLeafs.length; i++) {
          const leaf = seedLeafs[i]
          if (i > 0) {
            sql += ', '
          }
          sql += '(?, ?, ?, ?, ?, ?, ?)'
          values.push(leaf.leafId)
          values.push(leaf.en)
          values.push(leaf.es)
          values.push(leaf.gender)
          values.push(leaf.mnemonic)
          values.push(leaf.suspended)
          values.push(leaf.type)
        }
        sql += ';'
        tx.executeSql(sql, values, () => resolve())
      },
      (e: Error) => reject(`Error from INSERT into leafs: ${e.message}`)
    )
  )
}

// Returns Promise with Leaf with leafId set
export function insertRow(db: Db, leaf: Leaf): Promise<Leaf> {
  return new Promise((resolve, reject) =>
    db.transaction(
      tx => tx.executeSql(
        `INSERT INTO leafs (en, es, gender, mnemonic, suspended, type)
        VALUES (?, ?, ?, ?, ?, ?);`,
        [leaf.en, leaf.es, leaf.gender, leaf.mnemonic, leaf.suspended,
          leaf.type],
        (tx: any, result: any) => resolve({ ...leaf, leafId: result.insertId })
      ),
      (e: Error) => reject(`Error from INSERT into leafs: ${e.message}`)
    )
  )
}

export function deleteRow(db: Db, leaf: Leaf): Promise<void> {
  return new Promise((resolve, reject) =>
    db.transaction(
      tx => tx.executeSql(
        'DELETE FROM leafs WHERE leafId=?;',
        [leaf.leafId],
        (tx: any, result: any) => {
          if (result.rowsAffected !== 1) {
            reject(`rowsAffected=${result.rowsAffected} from DELETE FROM leafs`)
          } else {
            resolve()
          }
        }
      ),
      (e: Error) => reject(`Error from DELETE FROM leafs: ${e.message}`)
    )
  )
}

export function updateRow(db: Db, leaf: Leaf): Promise<void> {
  return new Promise((resolve, reject) =>
    db.transaction(
      tx => tx.executeSql(
        `UPDATE leafs SET en=?, es=?, gender=?, mnemonic=?, suspended=?, type=?
          WHERE leafId=?;`,
        [leaf.en, leaf.es, leaf.mnemonic, leaf.gender, leaf.suspended,
          leaf.type, leaf.leafId],
        (tx: any, result: any) => {
          if (result.rowsAffected !== 1) {
            reject(`rowsAffected=${result.rowsAffected} from UPDATE leafs`)
          } else {
            resolve()
          }
        }
      ),
      (e: Error) => reject(`Error from UPDATE leafs: ${e.message}`)
    )
  )
}

export function selectAll(db: Db): Promise<Array<Leaf>> {
  return new Promise((resolve, reject) =>
    db.transaction(
      tx => tx.executeSql(
        'SELECT leafId, en, es, gender, mnemonic, suspended, type FROM leafs',
        [],
        (tx, { rows: { _array } }) => resolve(_array.map(row => ({
          ...row,
          suspended: row.suspended === 1,
        })))
      ),
      (e: Error) => reject(`Error from SELECT FROM leafs: ${e.message}`)
    )
  )
}
