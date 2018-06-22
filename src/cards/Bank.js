import type { BankModel } from './BankModel'
import type { Card } from './Card'
import * as cardsTable from '../db/cardsTable'
import type { Category } from './Category'
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
      .then(this._redoCategoryToCardIds)
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
          categoryToCardIds: {},
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

  _redoCategoryToCardIds = () => {
    const { skillByCardId } = this.bankModel

    const categoryToCardIds: {[Category]: Array<number>} = {}
    for (const skill of (Object.values(skillByCardId): any)) {
      let category: Category
      if (skill.delay === DELAY_THRESHOLD) {
        if (skill.lastSeenAt === 0) {
          category = 'NOT TESTED YET'
        } else {
          category = 'WRONG'
        }
      } else if (skill.delay < DELAY_THRESHOLD) {
        if (skill.endurance < 60 * 60) {
          category = 'JUST_STARTED'
        } else if (skill.endurance < 24 * 60 * 60) {
          category = 'ENDURANCE >= 1H'
        } else {
          category = 'ENDURANCE >= 1D'
        }
      } else if (skill.delay > DELAY_THRESHOLD) {
        category = 'NOT READY'
      } else {
        throw new Error('Impossible')
      }

      if (categoryToCardIds[category] === undefined) {
        categoryToCardIds[category] = []
      }
      categoryToCardIds[category].push(skill.cardId)
    }

    for (const category of Object.keys(categoryToCardIds)) {
      const cardIds = categoryToCardIds[category]
      cardIds.sort((cardId1: number, cardId2: number) => {
        const skill1 = skillByCardId[cardId1]
        const skill2 = skillByCardId[cardId2]
        return skill1.lastSeenAt < skill2.lastSeenAt ? -1 : 1
      })
    }

    this.bankModel = { ...this.bankModel, categoryToCardIds }
  }

  deleteDatabase = (): Promise<BankModel> =>
    cardsTable.drop(this.db)
      .then(() => skillsTable.drop(this.db))
      .then(() => cardsTable.create(this.db))
      .then(() => skillsTable.create(this.db))
      .then(this._loadFromCardsTable)
      .then(this._loadFromSkillsTable)
      .then(this._redoCategoryToCardIds)
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
      .then(this._redoCategoryToCardIds)
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
              const skill = skillByCardId[siblingCardId]
              if (skill === undefined) {
                throw new Error(`Can't find skill for cardId ${siblingCardId}`)
              }
              totalDelay += (updateByCardId[siblingCardId] === undefined)
                ? skill.delay
                : (updateByCardId[siblingCardId].delay || skill.delay)
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
      .then(this._redoCategoryToCardIds)
      .then(() => this.bankModel)
  }
}