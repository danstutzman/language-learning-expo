import type { Card } from '../bank/Card'
import type { Leaf } from './Leaf'

export type Model = {|
  allLeafs: Array<Leaf>,
  speakCardsByCategory: {[string]: Array<Card>},
|}
