import type { CardRow } from '../db/cardsTable'
import { cardToRow } from '../cards/Bank'
import * as cardsTable from '../db/cardsTable'
import Inf from '../cards/verbs/Inf'
import openDatabase from 'websql'
import RegV from '../cards/verbs/RegV'
import RegVPattern from '../cards/verbs/RegVPattern'

it('can create, seed, and drop', done => {
  const preguntar = new Inf(1, 'preguntar', 'ask', 'AR')
  const endsWithO = new RegVPattern(2, '-o', 'AR', 1, 1, 'PRES')
  const pregunto = new RegV(3, preguntar, endsWithO)
  const seedCards = [preguntar, endsWithO, pregunto]

  const expectedCardRows: Array<CardRow> = [
    {cardId: 1, type: 'Inf', contentJson: '{"es":"preguntar","en":"ask","infCategory":"AR"}'},
    {cardId: 2, type: 'RegVPattern', contentJson: '{"es":"-o","infCategory":"AR","number":1,"person":1,"tense":"PRES"}'},
    {cardId: 3, type: 'RegV', contentJson: '{"inf":1,"pattern":2}'},
  ]

  const db = openDatabase(':memory:', '1.0', 'description', 1)
  cardsTable.checkExists(db)
    .then(exists => expect(exists).toBe(false))
    .then(() => cardsTable.create(db))
    .then(() => cardsTable.checkExists(db))
    .then(exists => expect(exists).toBe(true))
    .then(() => cardsTable.insertRows(db, seedCards.map(cardToRow)))
    .then(() => cardsTable.selectAll(db))
    .then(cardRows => expect(cardRows).toEqual(expectedCardRows))
    .then(() => cardsTable.drop(db))
    .then(done)
    .catch(e => { done.fail(e); done() })
})