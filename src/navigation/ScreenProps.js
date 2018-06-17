import type { Exposure } from '../model/Exposure'
import type { Leaf } from '../model/Leaf'
import type { Model } from '../model/Model'

export type ScreenProps = {|
  addExposures: (exposures: Array<Exposure>) => void,
  addLeaf: (leaf: Leaf) => void,
  deleteLeaf: (leaf: Leaf) => void,
  editLeaf: (leaf: Leaf) => void,
  exportDatabase: () => void,
  reseedDatabase: () => Promise<void>,
  model: Model,
|}
