import type { Bank } from '../bank/Bank'
import type { Card } from './Card'
import DbModel from '../model/DbModel'
import type { Exposure } from '../model/Exposure'
import type { Leaf } from '../model/Leaf'
import N from './N'

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

  const byExposureCreatedAt = (leaf1: Leaf, leaf2: Leaf) => {
    const e1 = leafIdToLastExposure[leaf1.leafId] || { createdAt: 0 }
    const e2 = leafIdToLastExposure[leaf2.leafId] || { createdAt: 0 }
    return e1.createdAt < e2.createdAt ? -1 : 1
  }
  allLeafs.sort(byExposureCreatedAt)

  const speakCardsByCategory: {[string]: Array<Card>} = {
    'UNTESTED': [],
    'BROKEN': [],
    'REMEMBERED_1X': [],
    'REMEMBERED_2X': [],
    'REMEMBERED_5MIN': [],
    'REMEMBERED_1HOUR': [],
    'REMEMBERED_1DAY': [],
  }
  for (const leaf of allLeafs) {
    const lastExposure = leafIdToLastExposure[leaf.leafId]
    const penultimateExposure = leafIdToPenultimateExposure[leaf.leafId]

    let category: string
    if (lastExposure === undefined) {
      category = 'UNTESTED'
    } else if (lastExposure.type === 'RECALLED_ES') {
      category = 'BROKEN'
    } else if (penultimateExposure === undefined ||
      penultimateExposure.type === 'RECALLED_ES') {
      category = 'REMEMBERED_1X'
    } else {
      const memoryDuration = lastExposure.createdAt -
        penultimateExposure.createdAt
      if (memoryDuration >= 24 * 60 * 60) {
        category = 'REMEMBERED_1DAY'
      } else if (memoryDuration >= 60 * 60) {
        category = 'REMEMBERED_1HOUR'
      } else if (memoryDuration >= 5 * 60) {
        category = 'REMEMBERED_5MIN'
      } else {
        category = 'REMEMBERED_2X'
      }
    }

    if (leaf.type === 'N' && !leaf.suspended) {
      speakCardsByCategory[category].push(new N(leaf))
    }
  }

  return { allLeafs, speakCardsByCategory }
}