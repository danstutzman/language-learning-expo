import type { BankModel } from './BankModel'
import type { Card } from './Card'
import * as cardsTable from '../db/cardsTable'
import type { CardUpdate } from './CardUpdate'
import { STAGE0_NOT_READY_TO_TEST } from '../cards/Stage'
import { STAGE1_READY_TO_TEST } from '../cards/Stage'
import { STAGE2_WRONG } from '../cards/Stage'
import { STAGE3_PASSED } from '../cards/Stage'

export default class Bank {
  bankModel: BankModel
  db: any

  constructor(db: any) {
    this.db = db
  }

  init = (cards: Array<Card>): Promise<BankModel> =>
    this._initTables(cards)
      .then(this._loadFromCardsTable)
      .then(() => this.bankModel)

  _initTables = (cards: Array<Card>): Promise<void> =>
    Promise.all([
      cardsTable.checkExists(this.db),
    ]).then((exists: [boolean]) => {
      if (!exists[0]) {
        return cardsTable.drop(this.db)
          .then(() => cardsTable.create(this.db))
          .then(() => cardsTable.insert(this.db, cards))
      }
    })

  _loadFromCardsTable = (): Promise<void> =>
    cardsTable.selectAll(this.db)
      .then((cards: Array<Card>) => {
        const cardByLeafIdsCsv: {[string]: Card} = {}
        for (const card of cards) {
          cardByLeafIdsCsv[card.leafIdsCsv] = card
        }

        const ancestorLeafIdsCsvsByLeafIdCsv: {[string]: Array<string>} = {}
        for (const card of cards) {
          ancestorLeafIdsCsvsByLeafIdCsv[card.leafIdsCsv] = []
        }
        const descendantLeafIdsCsvsByLeafIdCsv: {[string]: Array<string>} = {}
        for (const card of cards) {
          descendantLeafIdsCsvsByLeafIdCsv[card.leafIdsCsv] = []
        }

        for (const card1 of cards) {
          const leafIdsCsv1 = card1.leafIdsCsv
          for (const card2 of cards) {
            const leafIdsCsv2 = card2.leafIdsCsv
            if (leafIdsCsv1 !== leafIdsCsv2) {
              if (leafIdsCsv1.indexOf(leafIdsCsv2) !== -1) {
                if (leafIdsCsv1.startsWith(`${leafIdsCsv2},`) ||
                  leafIdsCsv1.endsWith(`,${leafIdsCsv2}`) ||
                  leafIdsCsv1.indexOf(`,${leafIdsCsv2},`) !== -1) {
                  ancestorLeafIdsCsvsByLeafIdCsv[leafIdsCsv2].push(leafIdsCsv1)
                  descendantLeafIdsCsvsByLeafIdCsv[leafIdsCsv1].push(
                    leafIdsCsv2)
                }
              }
            }
          }
        }

        this.bankModel = {
          ancestorLeafIdsCsvsByLeafIdCsv,
          cardByLeafIdsCsv,
          descendantLeafIdsCsvsByLeafIdCsv,
          stageToLeafIdsCsvs: {},
        }
        this._recalcStageToLeafIdsCsvs()
      })

  _recalcStageToLeafIdsCsvs = (): BankModel => {
    const cards: Array<Card> =
      (Object.values(this.bankModel.cardByLeafIdsCsv): any)
    cards.sort((card1: Card, card2: Card) => {
      if (card1.lastSeenAt === null) { return -1 }
      if (card2.lastSeenAt === null) { return 1 }
      return (card1.lastSeenAt < card2.lastSeenAt) ? -1 : 1
    })

    const stageToLeafIdsCsvs: {[number]: Array<string>} = {}
    for (const card: Card of cards) {
      if (stageToLeafIdsCsvs[card.stage] === undefined) {
        stageToLeafIdsCsvs[card.stage] = []
      }
      stageToLeafIdsCsvs[card.stage].push(card.leafIdsCsv)
    }
    this.bankModel = { ...this.bankModel, stageToLeafIdsCsvs }
    return this.bankModel
  }

  deleteDatabase = (): Promise<BankModel> =>
    cardsTable.drop(this.db)
      .then(() => cardsTable.create(this.db))
      .then(this._loadFromCardsTable)
      .then(() => this.bankModel)

  replaceDatabase = (
    cards: Array<Card>
  ): Promise<BankModel> =>
    cardsTable.drop(this.db)
      .then(() => this._initTables(cards))
      .then(this._loadFromCardsTable)
      .then(() => this.bankModel)

  updateCards = (triggeringCardUpdates: Array<CardUpdate>):
    Promise<BankModel> => {
    const {
      ancestorLeafIdsCsvsByLeafIdCsv,
      cardByLeafIdsCsv,
      descendantLeafIdsCsvsByLeafIdCsv,
    } = this.bankModel

    const triggeringCardUpdateByLeafCardId: {[string]: CardUpdate} = {}
    for (const triggeringCardUpdate of triggeringCardUpdates) {
      triggeringCardUpdateByLeafCardId[triggeringCardUpdate.leafIdsCsv] =
        triggeringCardUpdate
    }

    const bubbledCardUpdateByLeafCardId: {[string]: CardUpdate} = {}
    for (const triggeringCardUpdate of triggeringCardUpdates) {
      const triggeredLeafIdsCsv = triggeringCardUpdate.leafIdsCsv

      for (const ancestorLeafIdsCsv of
        ancestorLeafIdsCsvsByLeafIdCsv[triggeredLeafIdsCsv]) {
        let readyToTest: boolean = true
        for (const descendantOfAncestorLeafIdsCsv of
          descendantLeafIdsCsvsByLeafIdCsv[ancestorLeafIdsCsv]) {
          const descendantOfAncestorCard =
            triggeringCardUpdateByLeafCardId[descendantOfAncestorLeafIdsCsv] ||
            cardByLeafIdsCsv[descendantOfAncestorLeafIdsCsv]
          const descendantStage = descendantOfAncestorCard.stage
          if (descendantStage === STAGE0_NOT_READY_TO_TEST ||
            descendantStage === STAGE1_READY_TO_TEST ||
            descendantStage === STAGE2_WRONG) {
            readyToTest = false
          }
        }

        const ancestorCard =
          triggeringCardUpdateByLeafCardId[ancestorLeafIdsCsv] ||
          cardByLeafIdsCsv[ancestorLeafIdsCsv]
        let newAncestorStage = ancestorCard.stage
        if (readyToTest && newAncestorStage === STAGE0_NOT_READY_TO_TEST) {
          newAncestorStage = STAGE1_READY_TO_TEST
        } else if (!readyToTest) {
          newAncestorStage = STAGE0_NOT_READY_TO_TEST
        }

        bubbledCardUpdateByLeafCardId[ancestorLeafIdsCsv] =
          { leafIdsCsv: ancestorLeafIdsCsv, stage: newAncestorStage }
      }
    }
    const allCardUpdates: Array<CardUpdate> = triggeringCardUpdates.concat(
      (Object.values(bubbledCardUpdateByLeafCardId): any))

    const newCardByLeafIdsCsv = { ...this.bankModel.cardByLeafIdsCsv } // copy
    for (const cardUpdate of allCardUpdates) {
      newCardByLeafIdsCsv[cardUpdate.leafIdsCsv] = {
        ...newCardByLeafIdsCsv[cardUpdate.leafIdsCsv],
        ...cardUpdate,
      }
    }
    this.bankModel.cardByLeafIdsCsv = newCardByLeafIdsCsv

    this._recalcStageToLeafIdsCsvs()

    return cardsTable.updateCards(this.db, allCardUpdates)
      .then(() => this.bankModel)
  }
}