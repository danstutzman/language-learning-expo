import type { Card } from './Card'
import type { Leaf } from './Leaf'

export type Model = {|
  allLeafs: Array<Leaf>,
  slowSpeakLeafs: Array<Leaf>,
  speakCards: Array<Card>,
|}
