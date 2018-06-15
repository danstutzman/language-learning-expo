import type { Leaf } from './Leaf'

export type Model = {|
  allLeafs: Array<Leaf>,
  leafIdToCategory: {[number]: string},
  speakLeafs: Array<Leaf>,
|}
