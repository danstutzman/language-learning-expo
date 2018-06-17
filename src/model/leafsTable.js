import type { Leaf } from './Leaf'
import type { Db } from './Db'
import seedLeafs from './seedLeafs'
import validateLeafFields from './validateLeafFields'
import { LEAF_TYPE_TO_FIELDS } from './LeafType'

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
          type TEXT NOT NULL,
          en TEXT NOT NULL,
          es TEXT NOT NULL,
          mnemonic TEXT NOT NULL,
          suspended BOOLEAN NOT NULL,

          gender TEXT,
          infCategory TEXT,
          number INTEGER,
          person INTEGER,
          tense TEXT
        )`,
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
        let sql = `INSERT INTO leafs (
            type,
            en,
            es,
            mnemonic,
            suspended,
            gender,
            infCategory,
            number,
            person,
            tense
          ) VALUES `
        const values = []
        for (let i = 0; i < seedLeafs.length; i++) {
          const leaf = validateLeafFields(seedLeafs[i])

          if (i > 0) {
            sql += ', '
          }
          sql += '(?,?,?,?,?,?,?,?,?,?)'
          values.push(leaf.type)
          values.push(leaf.en)
          values.push(leaf.es)
          values.push(leaf.mnemonic)
          values.push(leaf.suspended)
          values.push(leaf.gender)
          values.push(leaf.infCategory)
          values.push(leaf.number)
          values.push(leaf.person)
          values.push(leaf.tense)
        }
        tx.executeSql(sql, values, () => resolve())
      },
      (e: Error) => reject(`Error from INSERT into leafs: ${e.message}`)
    )
  )
}

// Returns Promise with Leaf with leafId set
export function insertRow(db: Db, leafUnvalidated: Leaf): Promise<Leaf> {
  const leaf = validateLeafFields(leafUnvalidated)
  return new Promise((resolve, reject) =>
    db.transaction(
      tx => tx.executeSql(
        `INSERT INTO leafs (
          type,
          en,
          es,
          mnemonic,
          suspended,
          gender,
          infCategory,
          number,
          person,
          tense
        ) VALUES (?,?,?,?,?,?,?,?,?,?)`,
        [leaf.type,
          leaf.en,
          leaf.es,
          leaf.mnemonic,
          leaf.suspended,
          leaf.gender,
          leaf.infCategory,
          leaf.number,
          leaf.person,
          leaf.tense],
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

export function updateRow(db: Db, leafUnvalidated: Leaf): Promise<void> {
  const leaf = validateLeafFields(leafUnvalidated)
  return new Promise((resolve, reject) =>
    db.transaction(
      tx => tx.executeSql(
        `UPDATE leafs SET
          type=?,
          en=?,
          es=?,
          mnemonic=?,
          suspended=?,
          gender=?,
          infCategory=?,
          number=?,
          person=?,
          tense=?
          WHERE leafId=?`,
        [leaf.type,
          leaf.en,
          leaf.es,
          leaf.mnemonic,
          leaf.suspended,
          leaf.gender,
          leaf.infCategory,
          leaf.number,
          leaf.person,
          leaf.tense,
          leaf.leafId],
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
        `SELECT
          leafId,
          type,
          en,
          es,
          mnemonic,
          suspended,
          gender,
          infCategory,
          number,
          person,
          tense
          FROM leafs`,
        [],
        (tx, { rows: { _array } }) => resolve(_array.map(row => {
          row.suspended = (row.suspended === 1)

          const hasField = LEAF_TYPE_TO_FIELDS[row.type]
          if (hasField === undefined) {
            throw new Error(`Unknown type ${row.type}`)
          }
          for (const field of Object.keys(hasField)) {
            if (!hasField[field]) {
              delete row[field]
            }
          }
          return row
        }))
      ),
      (e: Error) => reject(`Error from SELECT FROM leafs: ${e.message}`)
    )
  )
}