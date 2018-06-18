import { assertInf } from '../cards/verbs/Inf'
import { assertInfCategory } from '../enums/InfCategory'
import { assertNumber } from '../enums/Number'
import { assertPerson } from '../enums/Person'
import { assertRegVPattern } from '../cards/verbs/RegVPattern'
import { assertTense } from '../enums/Tense'
import type { Card } from '../cards/Card'
import Inf from '../cards/verbs/Inf'
import RegV from '../cards/verbs/RegV'
import RegVPattern from '../cards/verbs/RegVPattern'

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

function seedNonInterdependent(
  db: any, cards: Array<Card>): Promise<void> {
  return new Promise((resolve, reject) =>
    db.transaction(
      tx => {
        if (cards.length === 0) { return resolve() }

        let sql = `INSERT INTO cards
          (type, contentJson)
          VALUES `
        const values = []
        for (let i = 0; i < cards.length; i++) {
          const card: Card = cards[i]

          if (i > 0) {
            sql += ', '
          }
          sql += '(?,?)'
          values.push(card.constructor.name)
          values.push(card.getContentJson())
        }
        tx.executeSql(sql, values, (tx: any, result: any) => {
          let cardId = result.insertId - cards.length + 1
          for (const card of cards) {
            card.cardId = cardId
            cardId += 1
          }
          resolve()
        })
      },
      (e: Error) => reject(`Error from INSERT INTO cards: ${e.message}`)
    )
  )
}

const STAGE1_CARD_TYPES = { Inf: true, RegVPattern: true }
const STAGE2_CARD_TYPES = { RegV: true }

export function seed(db: any, cards: Array<Card>): Promise<void> {
  return seedNonInterdependent(db,
    cards.filter(card => STAGE1_CARD_TYPES[card.constructor.name]))
    .then(() => seedNonInterdependent(db,
      cards.filter(card => STAGE2_CARD_TYPES[card.constructor.name])))
}

function assertString(value: any): string {
  if (typeof value !== 'string') {
    throw new Error(`Unexpected non-string ${JSON.stringify(value)}`)
  }
  return value
}

type Row = {|
  cardId: number,
  type: string,
  contentJson: string,
|}

function rowToCard(row: Row, cardByCardId: {[number]: Card}): Card {
  const content = JSON.parse(row.contentJson)
  if (row.type === 'Inf') {
    return new Inf(
      row.cardId,
      assertString(content.es),
      assertString(content.en),
      assertInfCategory(content.infCategory))
  } else if (row.type === 'RegV') {
    return new RegV(
      row.cardId,
      assertInf(cardByCardId[content.inf]),
      assertRegVPattern(cardByCardId[content.pattern]))
  } else if (row.type === 'RegVPattern') {
    return new RegVPattern(
      row.cardId,
      assertString(content.es),
      assertInfCategory(content.infCategory),
      assertNumber(content.number),
      assertPerson(content.person),
      assertTense(content.tense))
  } else {
    throw new Error(`Unknown card type ${row.type}`)
  }
}

export function selectAll(db: any): Promise<{[number]: Card}> {
  return new Promise((resolve, reject) =>
    db.transaction(
      tx => tx.executeSql(
        `SELECT cardId, type, contentJson FROM cards ORDER BY cardId`,
        [],
        (tx, { rows: { _array } }) => {
          const cardByCardId: {[number]: Card} = {}
          for (const row of _array) {
            cardByCardId[row.cardId] = rowToCard(row, cardByCardId)
          }
          resolve(cardByCardId)
        }
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