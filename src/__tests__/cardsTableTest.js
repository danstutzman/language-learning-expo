import type { Card } from '../cards/Card'
import * as cardsTable from '../db/cardsTable'
import Inf from '../cards/verbs/Inf'
import openDatabase from 'websql'
import RegV from '../cards/verbs/RegV'
import RegVPattern from '../cards/verbs/RegVPattern'

it('can create, seed, and drop', done => {
  const preguntar0 = new Inf(0, 'pregunt-', 'ask', 'AR')
  const endsWithO0 = new RegVPattern(0, '-o', 'AR', 1, 1, 'PRES')
  const pregunto0 = new RegV(0, preguntar0, endsWithO0)
  const seedCards: Array<Card> = [preguntar0, endsWithO0, pregunto0]

  const preguntar1 = new Inf(1, 'pregunt-', 'ask', 'AR')
  const endsWithO2 = new RegVPattern(2, '-o', 'AR', 1, 1, 'PRES')
  const pregunto3 = new RegV(3, preguntar1, endsWithO2)
  const expectedCardByCardId: {[number]: Card} = {
    [1]: preguntar1,
    [2]: endsWithO2,
    [3]: pregunto3,
  }

  const db = openDatabase(':memory:', '1.0', 'description', 1)
  cardsTable.checkExists(db)
    .then(exists => expect(exists).toBe(false))
    .then(() => cardsTable.create(db))
    .then(() => cardsTable.checkExists(db))
    .then(exists => expect(exists).toBe(true))
    .then(() => cardsTable.seed(db, seedCards))
    .then(() => cardsTable.selectAll(db))
    .then(cardByCardId => expect(cardByCardId).toEqual(expectedCardByCardId))
    .then(() => cardsTable.drop(db))
    .then(done)
    .catch(e => { done.fail(e); done() })
})