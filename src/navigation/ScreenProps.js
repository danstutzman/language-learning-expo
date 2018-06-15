import type { Leaf } from '../model/Leaf'
import type { LeafIdRememberedPair } from '../model/LeafIdRememberedPair'
import type { Model } from '../model/Model'

export type ScreenProps = {|
  addLeaf: (leaf: Leaf) => void,
  exposeLeafs: (pairs: Array<LeafIdRememberedPair>, createdAtSeconds: number) =>
   void,
  deleteLeaf: (leaf: Leaf) => void,
  editLeaf: (leaf: Leaf) => void,
  exportDatabase: () => void,
  reseedDatabase: () => Promise<void>,
  model: Model,
|}
