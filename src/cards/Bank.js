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
        const cardByCardId: {[number]: Card} = {}
        for (const card of cards) {
          cardByCardId[card.cardId] = card
        }

        const ancestorCardIdsByCardId: {[number]: Array<number>} = {}
        for (const card of cards) {
          ancestorCardIdsByCardId[card.cardId] = []
        }
        const descendantCardIdsByCardId: {[number]: Array<number>} = {}
        for (const card of cards) {
          descendantCardIdsByCardId[card.cardId] = []
        }

        for (const card1 of cards) {
          const cardId1 = card1.cardId
          const leafIdsCsv1Surrounded = `,${card1.leafIdsCsv},`
          for (const card2 of cards) {
            const cardId2 = card2.cardId
            const leafIdsCsv2 = card2.leafIdsCsv
            if (cardId1 !== cardId2) {
              if (leafIdsCsv1Surrounded.indexOf(leafIdsCsv2) !== -1) {
                ancestorCardIdsByCardId[cardId2].push(cardId1)
                descendantCardIdsByCardId[cardId1].push(cardId2)
              }
            }
          }
        }

        const leafIdToLeafCardId: {[number]: number} = {}
        for (const card of cards) {
          if (card.glossRows.length === 1) {
            leafIdToLeafCardId[card.glossRows[0].leafId] = card.cardId
          }
        }

        this.bankModel = {
          ancestorCardIdsByCardId,
          cardByCardId,
          descendantCardIdsByCardId,
          leafIdToLeafCardId,
          stageToCardIds: {},
        }
        this._recalcStageToCardIds()
      })

  _recalcStageToCardIds = (): BankModel => {
    const cards: Array<Card> =
      (Object.values(this.bankModel.cardByCardId): any)
    cards.sort((card1: Card, card2: Card) => {
      if (card1.lastSeenAt === null) { return -1 }
      if (card2.lastSeenAt === null) { return 1 }
      return (card1.lastSeenAt < card2.lastSeenAt) ? -1 : 1
    })

    const stageToCardIds: {[number]: Array<number>} = {}
    for (const card: Card of cards) {
      if (stageToCardIds[card.stage] === undefined) {
        stageToCardIds[card.stage] = []
      }
      stageToCardIds[card.stage].push(card.cardId)
    }
    this.bankModel = { ...this.bankModel, stageToCardIds }
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
      ancestorCardIdsByCardId,
      cardByCardId,
      descendantCardIdsByCardId,
    } = this.bankModel

    const triggeringCardUpdateByCardId: {[number]: CardUpdate} = {}
    for (const triggeringCardUpdate of triggeringCardUpdates) {
      triggeringCardUpdateByCardId[triggeringCardUpdate.cardId] =
        triggeringCardUpdate
    }

    const bubbledCardUpdateByLeafCardId: {[number]: CardUpdate} = {}
    for (const triggeringCardUpdate of triggeringCardUpdates) {
      const triggeredCardId = triggeringCardUpdate.cardId

      for (const ancestorCardId of
        ancestorCardIdsByCardId[triggeredCardId]) {
        let readyToTest: boolean = true
        for (const descendantCardId of
          descendantCardIdsByCardId[ancestorCardId]) {
          const descendantCard =
            triggeringCardUpdateByCardId[descendantCardId] ||
            cardByCardId[descendantCardId]
          const descendantStage = descendantCard.stage
          if (descendantStage === STAGE0_NOT_READY_TO_TEST ||
            descendantStage === STAGE1_READY_TO_TEST ||
            descendantStage === STAGE2_WRONG) {
            readyToTest = false
          }
        }

        const ancestorCard =
          triggeringCardUpdateByCardId[ancestorCardId] ||
          cardByCardId[ancestorCardId]
        let newAncestorStage = ancestorCard.stage
        if (readyToTest && newAncestorStage === STAGE0_NOT_READY_TO_TEST) {
          newAncestorStage = STAGE1_READY_TO_TEST
        } else if (!readyToTest) {
          newAncestorStage = STAGE0_NOT_READY_TO_TEST
        }

        bubbledCardUpdateByLeafCardId[ancestorCardId] =
          { cardId: ancestorCardId, stage: newAncestorStage }
      }
    }
    const allCardUpdates: Array<CardUpdate> = triggeringCardUpdates.concat(
      (Object.values(bubbledCardUpdateByLeafCardId): any))

    const newCardByCardId = { ...this.bankModel.cardByCardId } // copy
    for (const cardUpdate of allCardUpdates) {
      newCardByCardId[cardUpdate.cardId] = {
        ...newCardByCardId[cardUpdate.cardId],
        ...cardUpdate,
      }
    }
    this.bankModel.cardByCardId = newCardByCardId

    this._recalcStageToCardIds()

    return cardsTable.updateCards(this.db, allCardUpdates)
      .then(() => this.bankModel)
  }
}