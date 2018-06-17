import type { Card } from './Card'
import type { Leaf } from '../model/Leaf'

export type Bank = {|
  allLeafs: Array<Leaf>,
  speakCardsByCategory: {[string]: Array<Card>},
|}
