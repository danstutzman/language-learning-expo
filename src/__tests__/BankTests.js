import openDatabase from 'websql'
import Bank from '../cards/Bank'

it('works', done => {
  const cardSeeds = [
    { type: 'Inf',
      es: 'preguntar',
      enPresent: 'ask',
      enPast: 'asked',
      infCategory: 'AR',
    },
    { type: 'RegVPattern',
      infCategory: 'AR',
      number: 1,
      person: 1,
      tense: 'PRES',
      es: '-o',
    },
    { type: 'RegV',
      infKey: 'preguntar',
      patternKey: 'AR11PRES',
    },
  ]

  const db = openDatabase(':memory:', '1.0', 'description', 1)
  const bank = new Bank(db)
  bank.init(cardSeeds, [])
    .then(() => expect(bank.exportDatabase()).toEqual(
      `Paste in src/cards/seeds/cardSeeds.js:

[{"type":"Inf","es":"preguntar","enPresent":"ask","enPast":"asked","infCategory":"AR"},
{"type":"RegVPattern","es":"-o","infCategory":"AR","number":1,"person":1,"tense":"PRES"},
{"type":"RegV","infKey":"preguntar","patternKey":"AR11PRES"}]

Paste in src/cards/seeds/skillSeeds.js:

[]`))
    .then(() => done())
    .catch(e => { done.fail(e); done() })
})