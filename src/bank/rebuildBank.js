import type { Bank } from '../bank/Bank'
import type { Card } from './Card'
import DbModel from '../model/DbModel'
import type { Exposure } from '../model/Exposure'
import type { Leaf } from '../model/Leaf'

export default function rebuildBank(dbModel: DbModel): Bank {
  const { allExposures, allLeafs } = dbModel

  const leafIdToLastExposure: {[number]: Exposure} = {}
  const leafIdToPenultimateExposure: {[number]: Exposure} = {}
  for (const exposure of allExposures) {
    for (const leafId of exposure.leafIds) {
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
  }

  const nounLeafs = allLeafs.filter((leaf =>
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
    } else if (lastExposure.type === 'RECALLED_ES') {
      category = 'BROKEN'
      matureAt = lastExposure.createdAt + 60
    } else if (penultimateExposure === undefined ||
      penultimateExposure.type === 'RECALLED_ES') {
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

  return { allLeafs, speakCardsByCategory }
}