import * as cardsTable from '../db/cardsTable'
import openDatabase from 'websql'

it('can create, seed, and drop', done => {
  const cards = [{
    cardId: 1,
    type: 'Inf',
    key: 'preguntar',
    childrenCardIds: [],
    glossRows: [{ cardId: 1, en: 'ask', es: 'preguntar' }],
    quizQuestion: 'to ask',
  }]

  const db = openDatabase(':memory:', '1.0', 'description', 1)
  cardsTable.checkExists(db)
    .then(exists => expect(exists).toBe(false))
    .then(() => cardsTable.create(db))
    .then(() => cardsTable.checkExists(db))
    .then(exists => expect(exists).toBe(true))
    .then(() => cardsTable.insertRows(db, cards))
    .then(() => cardsTable.selectAll(db))
    .then(newCards => expect(newCards).toEqual(cards))
    .then(() => cardsTable.drop(db))
    .then(done)
    .catch(e => { done.fail(e); done() })
})