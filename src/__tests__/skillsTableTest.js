import * as skillsTable from '../db/skillsTable'
import openDatabase from 'websql'

it('can create, seed, and drop', done => {
  const db = openDatabase(':memory:', '1.0', 'description', 1)
  const skillRow = {
    cardId: 1,
    mnemonic: 'this is the mnemonic',
    delay: 2,
    endurance: 3,
    lastCorrectAt: 4,
  }
  skillsTable.checkExists(db)
    .then(exists => expect(exists).toBe(false))
    .then(() => skillsTable.create(db))
    .then(() => skillsTable.checkExists(db))
    .then(exists => expect(exists).toBe(true))
    .then(() => skillsTable.insertRows(db, [skillRow]))
    .then(() => skillsTable.selectAll(db))
    .then(skillRows => expect(skillRows[0]).toEqual(skillRow))
    .then(() => skillsTable.drop(db))
    .then(done)
    .catch(e => { done.fail(e); done() })
})