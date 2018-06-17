import { SQLite } from 'expo'

import type { Exposure } from './Exposure'
import * as exposuresTable from './exposuresTable'
import type { Leaf } from './Leaf'
import * as leafsTable from './leafsTable'

export default class DbModel {
  db: any
  allLeafs: Array<Leaf>
  allExposures: Array<Exposure>

  constructor() {
    this.db = SQLite.openDatabase('db.db')
  }

  init = (): Promise<void> =>
    this._initLeafsTable()
      .then(this._initExposuresTable)
      .then(this._loadFromTables)

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

  _loadFromTables = (): Promise<void> =>
    Promise.all([
      leafsTable.selectAll(this.db),
      exposuresTable.selectAll(this.db),
    ]).then((results: [Array<Leaf>, Array<Exposure>]) => {
      this.allLeafs = results[0]
      this.allExposures = results[1]
    })

  addLeaf = (leafWithoutLeafId: Leaf): Promise<void> =>
    leafsTable.insertRow(this.db, leafWithoutLeafId)
      .then((leafWithLeafId: Leaf) => {
        this.allLeafs.push(leafWithLeafId)
      })

  deleteLeaf = (leafToDelete: Leaf): Promise<void> =>
    leafsTable.deleteRow(this.db, leafToDelete)
      .then(() => {
        this.allLeafs = this.allLeafs.filter(leaf =>
          leaf.leafId !== leafToDelete.leafId)
      })

  editLeaf = (updatedLeaf: Leaf): Promise<void> =>
    leafsTable.updateRow(this.db, updatedLeaf)
      .then(() => {
        this.allLeafs = this.allLeafs.map(leaf =>
          leaf.leafId === updatedLeaf.leafId ? updatedLeaf : leaf)
      })

  addExposures = (exposures: Array<Exposure>): Promise<void> => {
    return exposuresTable.insertRows(this.db, exposures)
      .then((newExposures: Array<Exposure>) => {
        this.allExposures = this.allExposures.concat(newExposures)
      })
  }

  serializeForEmail(): string {
    const leafIdToEs: {[number]: string} = {}
    for (const leaf of this.allLeafs) {
      leafIdToEs[leaf.leafId] = leaf.es
    }

    const exposuresJson = JSON.stringify(this.allExposures.map(exposure => ({
      type: exposure.type,
      leafEss: exposure.leafIds.map(leafId => leafIdToEs[leafId]),
      createdAt: exposure.createdAt,
      delay: exposure.delay,
    })))

    const leafsJson = JSON.stringify(this.allLeafs.map(leaf => {
      const { type, en, es, gender } = leaf
      const mnemonic = leaf.mnemonic ? leaf.mnemonic : undefined
      if (type === 'N') {
        return { type, en, es, gender, mnemonic }
      } else if (type === 'Det') {
        return { type, en, es, gender }
      }
    })).replace(/,{"type"/g, ',\n{"type"')

    return `Paste in src/model/exposuresExport.js:

    ${exposuresJson}

    Paste in src/model/seedLeafs.js:

    ${leafsJson}`
  }

  reseedDatabase = (): Promise<void> =>
    leafsTable.drop(this.db)
      .then(() => leafsTable.create(this.db))
      .then(() => leafsTable.seed(this.db))
      .then(() => exposuresTable.drop(this.db))
      .then(() => exposuresTable.create(this.db))
      .then(() => leafsTable.selectAll(this.db))
      .then((allLeafs: Array<Leaf>) => exposuresTable.seed(this.db, allLeafs))
      .then(this._loadFromTables)
}
