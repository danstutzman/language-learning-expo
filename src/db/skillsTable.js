export type SkillRow = {|
  cardId: number,
  mnemonic: string,
  delay: number, // estimated milliseconds to recall; 0 if incorrect answer

  // seconds between timestamp of 2nd last and last test; 0 if not two answers
  endurance: number,
|}

export function checkExists(db: any): Promise<boolean> {
  return new Promise((resolve, reject) =>
    db.transaction(
      tx => tx.executeSql(
        `SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name=?;`,
        ['skills'],
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
        `CREATE TABLE skills (
          cardId INTEGER PRIMARY KEY NOT NULL,
          mnemonic TEXT NOT NULL,
          delay INTEGER NOT NULL,
          endurance INTEGER NOT NULL
        )`,
        [],
        () => resolve()
      ),
      (e: Error) => reject(`Error from CREATE TABLE skills: ${e.message}`)
    )
  })
}

export function insertRows(db: any, skillRows: Array<SkillRow>): Promise<void> {
  return new Promise((resolve, reject) =>
    db.transaction(
      tx => {
        if (skillRows.length === 0) { return resolve() }

        let sql = `INSERT INTO skills
          (cardId, mnemonic, delay, endurance)
          VALUES `
        const values = []
        for (let i = 0; i < skillRows.length; i++) {
          const skillRow: SkillRow = skillRows[i]

          if (i > 0) {
            sql += ', '
          }
          sql += '(?,?,?,?)'
          values.push(skillRow.cardId)
          values.push(skillRow.mnemonic)
          values.push(skillRow.delay)
          values.push(skillRow.endurance)
        }
        tx.executeSql(sql, values, () => resolve())
      },
      (e: Error) => reject(`Error from INSERT INTO skills: ${e.message}`)
    )
  )
}

export function selectAll(db: any): Promise<Array<SkillRow>> {
  return new Promise((resolve, reject) =>
    db.transaction(
      tx => tx.executeSql(
        `SELECT cardId, mnemonic, delay, endurance FROM skills`,
        [],
        (tx, { rows: { _array } }) => resolve(_array)
      ),
      (e: Error) => reject(`Error from SELECT FROM skills: ${e.message}`)
    )
  )
}

export function drop(db: any): Promise<void> {
  return new Promise((resolve, reject) =>
    db.transaction(
      tx => tx.executeSql(`DROP TABLE IF EXISTS skills`, [], () => resolve()),
      (e: Error) => reject(`Error from DROP TABLE skills: ${e.message}`)
    )
  )
}