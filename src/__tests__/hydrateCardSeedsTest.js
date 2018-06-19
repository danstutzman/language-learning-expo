import hydrateCardSeeds from '../cards/hydrateCardSeeds'
import Inf from '../cards/verbs/Inf'
import RegVPattern from '../cards/verbs/RegVPattern'
import RegV from '../cards/verbs/RegV'

it('works', () => {
  expect(hydrateCardSeeds()).toEqual([
    new Inf(1, 'pregunt-', 'ask', 'AR'),
    new RegVPattern(2, '-o', 'AR', 1, 1, 'PRES'),
    new RegV(3,
      new Inf(1, 'pregunt-', 'ask', 'AR'),
      new RegVPattern(2, '-o', 'AR', 1, 1, 'PRES')
    ),
  ])
})
