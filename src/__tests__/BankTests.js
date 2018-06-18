import openDatabase from 'websql'
import Bank from '../cards/Bank'

it('works', done => {
  const db = openDatabase(':memory:', '1.0', 'description', 1)
  const bank = new Bank(db)
  bank.init()
    .then(() => bank.reseedDatabase())
    .then(() => expect(bank.exportCards()).toEqual(
      `Paste in src/cards/hydrateCardSeeds.js:

[{"type":"Inf","es":"pregunt-","en":"ask","infCategory":"AR"},
{"type":"RegVPattern","es":"-o","infCategory":"AR","number":1,"person":1,"tense":"PRES"},
{"type":"RegV","infKey":"pregunt-AR","patternKey":"AR11PRES"}]`))
    .then(() => done())
    .catch(e => { done.fail(e); done() })
})