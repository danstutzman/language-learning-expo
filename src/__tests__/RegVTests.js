import Inf from '../cards/verbs/Inf'
import RegVPattern from '../cards/verbs/RegVPattern'
import RegV from '../cards/verbs/RegV'

it('works', () => {
  const preguntar = new Inf(0, 'pregunt-', 'ask', 'AR')
  const endsWithO = new RegVPattern(0, '-o', 'AR', 1, 1, 'PRES')
  const regV = new RegV(0, preguntar, endsWithO)
  expect(regV.getLeafCards()).toEqual([preguntar, endsWithO])
  const es = regV.getLeafCards().map(leaf =>
    leaf.es).join(' ').replace('- -', '')
  expect(es).toEqual('pregunto')
})
