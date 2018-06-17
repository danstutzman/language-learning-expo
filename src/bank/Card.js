import type { Leaf } from '../model/Leaf'

export interface Card {
  matureAt: number,
  +getLeafs: () => Array<Leaf>,
}