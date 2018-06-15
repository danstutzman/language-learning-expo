import { SQLite } from 'expo'

import type { Leaf } from './Leaf'
import * as leafsTable from './leafsTable'
import type { Exposure } from './Exposure'
import * as exposuresTable from './exposuresTable'
import type { Model } from './Model'

export default class DbModel {
  db: any
  allLeafs: Array<Leaf>
  allExposures: Array<Exposure>

  constructor() {
    this.db = SQLite.openDatabase('db.db')
  }

  init = (): Promise<Model> =>
    this._initLeafsTable()
      .then(this._initExposuresTable)
      .then(this._loadFromTables)
      .then(this._recomputeModel)

  _initLeafsTable = (): Promise<void> =>
    leafsTable.checkExists(this.db)
      .then((exists: boolean) => {
        if (!exists) {
          return leafsTable.create(this.db)
            .then(() => leafsTable.seed(this.db))
        }
      })

  _initExposuresTable = (): Promise<void> =>
    exposuresTable.checkExists(this.db)
      .then((exists: boolean) => {
        if (!exists) {
          return exposuresTable.create(this.db)
        }
      })

  _loadFromTables = (): Promise<void> => {
    return Promise.all([
      leafsTable.selectAll(this.db),
      exposuresTable.selectAll(this.db),
    ]).then((results: [Array<Leaf>, Array<Exposure>]) => {
      this.allLeafs = results[0]
      this.allExposures = results[1]
    })
  }

  // Reads in this.allLeafs and this.allExposures
  _recomputeModel = (): Model => {
    const leafIdToLastExposure: {[number]: Exposure} = {}
    for (const exposure of this.allExposures) {
      const lastExposure = leafIdToLastExposure[exposure.leafId]
      if (lastExposure === undefined ||
          exposure.createdAtSeconds > lastExposure.createdAtSeconds) {
        leafIdToLastExposure[exposure.leafId] = exposure
      }
    }

    // Sort non-exposed and earlier-exposed leafs first
    const speakLeafs = this.allLeafs.filter((leaf: Leaf) =>
      !leaf.suspended && leaf.type === 'EsN')
    speakLeafs.sort((c1: Leaf, c2: Leaf) => {
      const e1 = leafIdToLastExposure[c1.leafId]
      const e2 = leafIdToLastExposure[c2.leafId]
      if (e1 === undefined) { return -1 }
      if (e2 === undefined) { return 1 }
      return e1.createdAtSeconds < e2.createdAtSeconds ? -1 : 1
    })

    const leafIdToCategory: {[number]: string} = {}
    for (const leaf of this.allLeafs) {
      const exposure = leafIdToLastExposure[leaf.leafId]

      let category: string
      if (exposure === undefined) {
        category = 'FIRST_TIME'
      } else {
        if (exposure.remembered) {
          category = 'SUCCEEDED'
        } else {
          category = 'BROKEN'
        }
      }
      leafIdToCategory[leaf.leafId] = category
    }

    return { allLeafs: this.allLeafs, speakLeafs, leafIdToCategory }
  }

  addLeaf = (leafWithoutLeafId: Leaf): Promise<Model> =>
    leafsTable.insertRow(this.db, leafWithoutLeafId)
      .then((leafWithLeafId: Leaf) => {
        this.allLeafs.push(leafWithLeafId)
        return this._recomputeModel()
      })

  deleteLeaf = (leafToDelete: Leaf): Promise<Model> =>
    leafsTable.deleteRow(this.db, leafToDelete)
      .then(() => {
        this.allLeafs = this.allLeafs.filter(leaf =>
          leaf.leafId !== leafToDelete.leafId)
        return this._recomputeModel()
      })

  editLeaf = (updatedLeaf: Leaf): Promise<Model> =>
    leafsTable.updateRow(this.db, updatedLeaf)
      .then(() => {
        this.allLeafs = this.allLeafs.map(leaf =>
          leaf.leafId === updatedLeaf.leafId ? updatedLeaf : leaf)
        return this._recomputeModel()
      })

  addExposure = (exposure: Exposure): Promise<Model> =>
    exposuresTable.insertRow(this.db, exposure)
      .then(() => {
        this.allExposures.push(exposure)
        return this._recomputeModel()
      })

  serializeForEmail(): string {
    const leafIdToEs: {[number]: string} = {}
    for (const leaf of this.allLeafs) {
      leafIdToEs[leaf.leafId] = leaf.es
    }

    return JSON.stringify(this.allExposures.map(exposure => ({
      leafEs: leafIdToEs[exposure.leafId],
      remembered: exposure.remembered,
      createdAtSeconds: exposure.createdAtSeconds,
    })))
  }

  reseedDatabase = (): Promise<Model> =>
    leafsTable.drop(this.db)
      .then(() => leafsTable.create(this.db))
      .then(() => leafsTable.seed(this.db))
      .then(() => exposuresTable.drop(this.db))
      .then(() => exposuresTable.create(this.db))
      .then(() => leafsTable.selectAll(this.db))
      .then((allLeafs: Array<Leaf>) => exposuresTable.seed(this.db, allLeafs))
      .then(this._loadFromTables)
      .then(this._recomputeModel)
}
