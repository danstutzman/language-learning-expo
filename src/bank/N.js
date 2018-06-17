import type { Card } from './Card'
import type { Leaf } from '../model/Leaf'

export default class N implements Card {
  leaf: Leaf
  matureAt: number

  constructor(leaf: Leaf, matureAt: number) {
    this.leaf = leaf
    this.matureAt = matureAt
  }
  getLeafs(): Array<Leaf> {
    return [this.leaf]
  }
}