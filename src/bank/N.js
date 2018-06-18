import type { Card } from './Card'
import type { Leaf } from '../model/Leaf'

export default class N implements Card {
  leaf: Leaf

  constructor(leaf: Leaf) {
    this.leaf = leaf
  }
  getLeafs(): Array<Leaf> {
    return [this.leaf]
  }
}