import hydrateSeedsToCards from '../cards/seeds/hydrateSeedsToCards'
import Inf from '../cards/verbs/Inf'
import RegVPattern from '../cards/verbs/RegVPattern'
import RegV from '../cards/verbs/RegV'

it('works', () => {
  const seeds = [
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
  expect(hydrateSeedsToCards(seeds)).toEqual([
    new Inf(1, 'preguntar', 'ask', 'asked', 'AR'),
    new RegVPattern(2, '-o', 'AR', 1, 1, 'PRES'),
    new RegV(3,
      new Inf(1, 'preguntar', 'ask', 'asked', 'AR'),
      new RegVPattern(2, '-o', 'AR', 1, 1, 'PRES')
    ),
  ])
})
