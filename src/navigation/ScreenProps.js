import type { Bank } from '../bank/Bank'
import type { Exposure } from '../model/Exposure'
import type { Leaf } from '../model/Leaf'

export type ScreenProps = {|
  addExposures: (exposures: Array<Exposure>) => void,
  addLeaf: (leaf: Leaf) => void,
  deleteLeaf: (leaf: Leaf) => void,
  editLeaf: (leaf: Leaf) => void,
  exportDatabase: () => void,
  reseedDatabase: () => Promise<void>,
  bank: Bank,
|}
