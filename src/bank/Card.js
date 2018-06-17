import type { Leaf } from '../model/Leaf'

export type Card = {|
  leafs: Array<Leaf>,
  matureAt: number, // seconds since epoch
|}