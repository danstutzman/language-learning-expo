import type { Leaf } from './Leaf'

export type Card = {|
  leafs: Array<Leaf>,
  matureAt: number, // seconds since epoch
|}