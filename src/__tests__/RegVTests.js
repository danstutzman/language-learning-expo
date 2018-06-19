import Inf from '../cards/verbs/Inf'
import RegVPattern from '../cards/verbs/RegVPattern'
import RegV from '../cards/verbs/RegV'

it('works', () => {
  const preguntar = new Inf(1, 'preguntar', 'ask', 'AR')
  const endsWithA = new RegVPattern(2, '-a', 'AR', 1, 3, 'PRES')
  const regV = new RegV(3, preguntar, endsWithA)

  expect(regV.getContentJson()).toEqual('{"inf":1,"pattern":2}')
  expect(regV.getExport()).toEqual(
    {type: 'RegV', infKey: 'preguntar', patternKey: 'AR13PRES'})
  expect(regV.getGlossRows()).toEqual([
    {cardId: 1, en: 'asks', es: 'pregunt-'},
    {cardId: 2, en: '(he/she)', es: '-a'},
  ])
  expect(regV.getKey()).toEqual('preguntarAR13PRES')
  expect(regV.getQuizQuestion()).toEqual('(he/she) asks')
})
