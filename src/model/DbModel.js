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
    for (const exposure of this.allExposures) {
      const lastExposure = leafIdToLastExposure[exposure.leafId]
      if (lastExposure === undefined ||
          exposure.createdAtSeconds > lastExposure.createdAtSeconds) {
        leafIdToLastExposure[exposure.leafId] = exposure
      }
    }

    const isLeafReady = (leaf: Leaf) => {
      const lastExposure =
        leafIdToLastExposure[leaf.leafId] || { remembered: false }
      return !leaf.suspended && lastExposure.remembered
    }

    const nouns = this.allLeafs
      .filter((leaf: Leaf) => leaf.type === 'EsN')
      .filter(isLeafReady)

    const speakCards: Array<Card> = []
    for (const noun of nouns) {
      speakCards.push({ leafs: [noun] })
    }

    const earliestExposureCreatedAt = (card: Card) => {
      let earliest: number = 999999999999
      for (const leaf of card.leafs) {
        const lastExposure = leafIdToLastExposure[leaf.leafId]
        if (lastExposure === undefined) {
          earliest = 0
        } else if (lastExposure.createdAtSeconds < earliest) {
          earliest = lastExposure.createdAtSeconds
        }
      }
      return earliest
    }
    const byEarliestExposureCreatedAt = (card1: Card, card2: Card) =>
      earliestExposureCreatedAt(card1) < earliestExposureCreatedAt(card2) ?
        -1 : 1
    speakCards.sort(byEarliestExposureCreatedAt)

    const isLeafNounAndBroken = (leaf: Leaf) => {
      const lastExposure =
        leafIdToLastExposure[leaf.leafId] || { remembered: false }
      return leaf.type === 'EsN' && !lastExposure.remembered
    }

    const slowSpeakLeafs = this.allLeafs.filter(isLeafNounAndBroken)
    const byExposureCreatedAt = (leaf1: Leaf, leaf2: Leaf) => {
      const e1 = leafIdToLastExposure[leaf1.leafId] || { createdAtSeconds: 0 }
      const e2 = leafIdToLastExposure[leaf2.leafId] || { createdAtSeconds: 0 }
      return e1.createdAtSeconds < e2.createdAtSeconds ? -1 : 1
    }
    slowSpeakLeafs.sort(byExposureCreatedAt)

    return { allLeafs: this.allLeafs, slowSpeakLeafs, speakCards }
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
    createdAtSeconds: number
  ): Promise<Model> => {
    const exposures = pairs.map(pair => ({
      exposureId: 0,
      leafId: pair.leafId,
      remembered: pair.remembered,
      createdAtSeconds,
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
