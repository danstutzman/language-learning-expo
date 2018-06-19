import Inf from '../cards/verbs/Inf'
import RegVPattern from '../cards/verbs/RegVPattern'
import RegV from '../cards/verbs/RegV'

it('works', () => {
  const preguntar = new Inf(1, 'preguntar', 'ask', 'AR')
  const endsWithO = new RegVPattern(2, '-o', 'AR', 1, 1, 'PRES')
  const regV = new RegV(3, preguntar, endsWithO)

  expect(regV.getContentJson()).toEqual('{"inf":1,"pattern":2}')
  expect(regV.getExport()).toEqual(
    {type: 'RegV', infKey: 'preguntar', patternKey: 'AR11PRES'})
  expect(regV.getGlossRows()).toEqual([
    {cardId: 1, en: 'ask', es: 'pregunt-'},
    {cardId: 2, en: '(I)', es: '-o'},
  ])
  expect(regV.getKey()).toEqual('preguntarAR11PRES')
  expect(regV.getQuizQuestion()).toEqual('(I) ask')
})
