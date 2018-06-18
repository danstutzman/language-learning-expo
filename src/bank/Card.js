import type { Leaf } from '../model/Leaf'

export interface Card {
  +getLeafs: () => Array<Leaf>,
}