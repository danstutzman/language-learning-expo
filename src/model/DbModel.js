import { SQLite } from 'expo'

import type { Card } from './Card'
import type { Exposure } from './Exposure'
import type { Leaf } from './Leaf'
import type { LeafIdRememberedPair } from './LeafIdRememberedPair'
import * as leafsTable from './leafsTable'
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
    const leafIdToPenultimateExposure: {[number]: Exposure} = {}
    for (const exposure of this.allExposures) {
      const { leafId } = exposure
      const lastExposure = leafIdToLastExposure[leafId]
      const penultimateExposure = leafIdToPenultimateExposure[leafId]
      if (lastExposure === undefined) {
        leafIdToLastExposure[leafId] = exposure
      } else if (exposure.createdAt > lastExposure.createdAt) {
        leafIdToPenultimateExposure[leafId] = leafIdToLastExposure[leafId]
        leafIdToLastExposure[leafId] = exposure
      } else if (exposure.createdAt > penultimateExposure.createdAt) {
        leafIdToPenultimateExposure[leafId] = exposure
      }
    }

    const nounLeafs = this.allLeafs.filter((leaf =>
      leaf.type === 'EsN' && !leaf.suspended))
    const byExposureCreatedAt = (leaf1: Leaf, leaf2: Leaf) => {
      const e1 = leafIdToLastExposure[leaf1.leafId] || { createdAt: 0 }
      const e2 = leafIdToLastExposure[leaf2.leafId] || { createdAt: 0 }
      return e1.createdAt < e2.createdAt ? -1 : 1
    }
    nounLeafs.sort(byExposureCreatedAt)

    const speakCardsByCategory: {[string]: Array<Card>} = {
      'UNTESTED': [],
      'BROKEN': [],
      'REMEMBERED_1X': [],
      'REMEMBERED_2X': [],
      'REMEMBERED_5MIN': [],
      'REMEMBERED_1HOUR': [],
      'REMEMBERED_1DAY': [],
    }
    for (const leaf of nounLeafs) {
      const lastExposure = leafIdToLastExposure[leaf.leafId]
      const penultimateExposure = leafIdToPenultimateExposure[leaf.leafId]

      let category: string
      let matureAt: number
      if (lastExposure === undefined) {
        category = 'UNTESTED'
        matureAt = 0
      } else if (!lastExposure.remembered) {
        category = 'BROKEN'
        matureAt = lastExposure.createdAt + 60
      } else if (penultimateExposure === undefined ||
        !penultimateExposure.remembered) {
        category = 'REMEMBERED_1X'
        matureAt = lastExposure.createdAt + 300
      } else {
        const memoryDuration = lastExposure.createdAt -
          penultimateExposure.createdAt
        if (memoryDuration >= 24 * 60 * 60) {
          category = 'REMEMBERED_1DAY'
          matureAt = lastExposure.createdAt + 24 * 60 * 60
        } else if (memoryDuration >= 60 * 60) {
          category = 'REMEMBERED_1HOUR'
          matureAt = lastExposure.createdAt + 24 * 60 * 60
        } else if (memoryDuration >= 5 * 60) {
          category = 'REMEMBERED_5MIN'
          matureAt = lastExposure.createdAt + 60 * 60
        } else {
          category = 'REMEMBERED_2X'
          matureAt = lastExposure.createdAt + 5 * 60
        }
      }

      speakCardsByCategory[category].push({ leafs: [leaf], matureAt })
    }

    return { allLeafs: this.allLeafs, speakCardsByCategory }
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

  exposeLeafs = (
    pairs: Array<LeafIdRememberedPair>,
    createdAt: number
  ): Promise<Model> => {
    const exposures = pairs.map(pair => ({
      exposureId: 0,
      leafId: pair.leafId,
      remembered: pair.remembered,
      createdAt,
    }))
    return exposuresTable.insertRows(this.db, exposures)
      .then((newExposures: Array<Exposure>) => {
        this.allExposures = this.allExposures.concat(newExposures)
        return this._recomputeModel()
      })
  }

  serializeForEmail(): string {
    const leafIdToEs: {[number]: string} = {}
    for (const leaf of this.allLeafs) {
      leafIdToEs[leaf.leafId] = leaf.es
    }

    const exposuresJson = JSON.stringify(this.allExposures.map(exposure => ({
      leafEs: leafIdToEs[exposure.leafId],
      remembered: exposure.remembered,
      createdAt: exposure.createdAt,
    })))

    const leafsJson = JSON.stringify(this.allLeafs.map(leaf => {
      const { type, en, es, gender } = leaf
      const mnemonic = leaf.mnemonic ? leaf.mnemonic : undefined
      if (type === 'EsN') {
        return { type, en, es, gender, mnemonic }
      } else if (type === 'EsD') {
        return { type, en, es, gender }
      }
    })).replace(/,{"type"/g, ',\n{"type"')

    return `Paste in src/model/exposuresExport.js:

    ${exposuresJson}

    Paste in src/model/seedLeafs.js:

    ${leafsJson}`
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
