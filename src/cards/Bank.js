import type { BankModel } from './BankModel'
import type { Card } from './Card'
import * as cardsTable from '../db/cardsTable'
import { DELAY_THRESHOLD } from './Skill'
import type { Skill } from './Skill'
import * as skillsTable from '../db/skillsTable'
import type { SkillUpdate } from '../db/SkillUpdate'

export default class Bank {
  bankModel: BankModel
  db: any

  constructor(db: any) {
    this.db = db
  }

  init = (cards: Array<Card>, skills: Array<Skill>): Promise<BankModel> =>
    this._initTables(cards, skills)
      .then(this._loadFromCardsTable)
      .then(this._loadFromSkillsTable)
      .then(() => this.bankModel)

  _initTables = (cards: Array<Card>, skills: Array<Skill>): Promise<void> =>
    Promise.all([
      cardsTable.checkExists(this.db),
      skillsTable.checkExists(this.db),
    ]).then((exists: [boolean, boolean]) => {
      if (!exists[0] || !exists[1]) {
        return cardsTable.drop(this.db)
          .then(() => cardsTable.create(this.db))
          .then(() => cardsTable.insertRows(this.db, cards))
          .then(() => skillsTable.drop(this.db))
          .then(() => skillsTable.create(this.db))
          .then(() => skillsTable.insertRows(this.db, skills))
      }
    })

  _loadFromCardsTable = (): Promise<void> =>
    cardsTable.selectAll(this.db)
      .then((cards: Array<Card>) => {
        const cardByCardId: {[number]: Card} = {}
        for (const card of cards) {
          cardByCardId[card.cardId] = card
        }

        const parentCardIdsByCardId: {[number]: Array<number>} = {}
        for (const card of (Object.values(cardByCardId): any)) {
          for (const childCardId of card.childrenCardIds) {
            if (parentCardIdsByCardId[childCardId] === undefined) {
              parentCardIdsByCardId[childCardId] = []
            }
            parentCardIdsByCardId[childCardId].push(card.cardId)
          }
        }

        this.bankModel = {
          cardByCardId,
          parentCardIdsByCardId,
          skillByCardId: {},
        }
      })

  _loadFromSkillsTable = (): Promise<void> =>
    skillsTable.selectAll(this.db)
      .then((skills: Array<Skill>) => {
        const skillByCardId: {[number]: Skill} = {}
        for (const skill of skills) {
          skillByCardId[skill.cardId] = skill
        }

        this.bankModel = { ...this.bankModel, skillByCardId }
      })

  deleteDatabase = (): Promise<BankModel> =>
    skillsTable.drop(this.db)
      // .then(() => this._initTables(cardSeeds, skillSeeds))
      .then(this._loadFromCardsTable)
      .then(this._loadFromSkillsTable)
      .then(() => this.bankModel)

  replaceDatabase = (
    cards: Array<Card>,
    skills: Array<Skill>,
  ): Promise<BankModel> =>
    cardsTable.drop(this.db)
      .then(() => skillsTable.drop(this.db))
      .then(() => this._initTables(cards, skills))
      .then(this._loadFromCardsTable)
      .then(this._loadFromSkillsTable)
      .then(() => this.bankModel)

  updateSkills = (baseUpdates: Array<SkillUpdate>): Promise<BankModel> => {
    const {
      cardByCardId,
      parentCardIdsByCardId,
      skillByCardId
    } = this.bankModel

    const updateByCardId: {[number]: SkillUpdate} = {}
    let updatesToProcess = baseUpdates.slice() // copy
    while (updatesToProcess.length > 0) {
      const newUpdatesToProcess = []
      for (const update of updatesToProcess) {
        const { cardId, delay } = update

        updateByCardId[cardId] = update

        if (delay !== undefined) {
          for (const parentCardId of parentCardIdsByCardId[cardId] || []) {
            const parent = cardByCardId[parentCardId]
            if (parent === undefined) {
              throw new Error(
                `Can't find card for parentCardId ${parentCardId}`)
            }

            let totalDelay = 0
            for (const siblingCardId of parent.childrenCardIds) {
              totalDelay += (updateByCardId[siblingCardId] === undefined)
                ? skillByCardId[siblingCardId].delay
                : (updateByCardId[siblingCardId].delay ||
                  skillByCardId[siblingCardId].delay)
            }

            let newUpdate
            if (totalDelay >= DELAY_THRESHOLD) {
              newUpdate = {
                cardId: parent.cardId,
                delay: totalDelay,
                endurance: 0,
              }
            } else {
              newUpdate = {
                cardId: parent.cardId,
                delay: totalDelay,
              }
            }
            newUpdatesToProcess.push(newUpdate)
            updateByCardId[parent.cardId] = newUpdate
          }
        }
      }
      updatesToProcess = newUpdatesToProcess
    }
    const allUpdates: Array<SkillUpdate> = (Object.values(updateByCardId): any)

    const newSkillByCardId = { ...this.bankModel.skillByCardId } // copy
    for (const update of allUpdates) {
      const oldSkill = skillByCardId[update.cardId]
      if (oldSkill === undefined) {
        throw new Error(`Can't find skill for cardId=${update.cardId}`)
      }
      newSkillByCardId[update.cardId] = { ...oldSkill, ...update }
    }
    this.bankModel = { ...this.bankModel, skillByCardId: newSkillByCardId }

    return Promise.all(allUpdates.map(update =>
      skillsTable.updateRow(this.db, update)))
      .then(() => this.bankModel)
  }
}