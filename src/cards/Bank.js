import { assertCardType } from './enums/CardType'
import { assertInf } from '../cards/verbs/Inf'
import { assertInfCategory } from './enums/InfCategory'
import { assertNumber } from './enums/Number'
import { assertPerson } from './enums/Person'
import { assertRegVPattern } from '../cards/verbs/RegVPattern'
import { assertTense } from './enums/Tense'
import type { BankModel } from './BankModel'
import type { Card } from './Card'
import type { CardRow } from '../db/cardsTable'
import type { CardSeed } from './seeds/cardSeeds'
import * as cardsTable from '../db/cardsTable'
import hydrateCardSeeds from './seeds/hydrateCardSeeds'
import hydrateSkillSeeds from './seeds/hydrateSkillSeeds'
import Inf from '../cards/verbs/Inf'
import RegV from '../cards/verbs/RegV'
import RegVPattern from '../cards/verbs/RegVPattern'
import type { Skill } from './Skill'
import type { SkillRow } from '../db/skillsTable'
import type { SkillSeed } from './seeds/skillSeeds'
import * as skillsTable from '../db/skillsTable'
import type { SkillUpdate } from '../db/SkillUpdate'

function assertString(value: any): string {
  if (typeof value !== 'string') {
    throw new Error(`Unexpected non-string ${JSON.stringify(value)}`)
  }
  return value
}

function rowToCard(row: CardRow, cardByCardId: {[number]: Card}): Card {
  const content = JSON.parse(row.contentJson)
  if (row.type === 'Inf') {
    return new Inf(
      row.cardId,
      assertString(content.es),
      assertString(content.enPresent),
      assertString(content.enPast),
      assertInfCategory(content.infCategory))
  } else if (row.type === 'RegV') {
    return new RegV(
      row.cardId,
      assertInf(cardByCardId[content.inf]),
      assertRegVPattern(cardByCardId[content.pattern]))
  } else if (row.type === 'RegVPattern') {
    return new RegVPattern(
      row.cardId,
      assertString(content.es),
      assertInfCategory(content.infCategory),
      assertNumber(content.number),
      assertPerson(content.person),
      assertTense(content.tense))
  } else {
    throw new Error(`Unknown card type ${row.type}`)
  }
}

function rowToSkill(row: SkillRow, cardByCardId: {[number]: Card}): Skill {
  const card = cardByCardId[row.cardId]
  if (card === undefined) {
    throw new Error(`Can't find Card for cardId ${row.cardId}`)
  }

  const { mnemonic, delay, endurance, lastTestAt } = row
  return { card, cardId: row.cardId, mnemonic, delay, endurance, lastTestAt }
}

export function cardToRow(card: Card): CardRow {
  return {
    cardId: card.cardId,
    type: assertCardType(card.constructor.name),
    contentJson: card.getContentJson(),
  }
}

export function skillToRow(skill: Skill): SkillRow {
  const { cardId, mnemonic, delay, endurance, lastTestAt } = skill
  return { cardId, mnemonic, delay, endurance, lastTestAt }
}

export default class Bank {
  bankModel: BankModel
  db: any

  constructor(db: any) {
    this.db = db
  }

  init = (
    cardSeeds: Array<CardSeed>,
    skillSeeds: Array<SkillSeed>,
  ): Promise<BankModel> =>
    this._initTables(cardSeeds, skillSeeds)
      .then(this._loadFromCardsTable)
      .then(this._loadFromSkillsTable)
      .then(() => this.bankModel)

  _initTables = (
    cardSeeds: Array<CardSeed>,
    skillSeeds: Array<SkillSeed>,
  ): Promise<void> =>
    Promise.all([
      cardsTable.checkExists(this.db),
      skillsTable.checkExists(this.db),
    ]).then((exists: [boolean, boolean]) => {
      if (!exists[0] || !exists[1]) {
        return cardsTable.drop(this.db)
          .then(() => cardsTable.create(this.db))
          .then(() => {
            cardsTable.insertRows(this.db,
              hydrateCardSeeds(cardSeeds).map(cardToRow))
          })
          .then(() => this._loadFromCardsTable())
          .then(() => skillsTable.drop(this.db))
          .then(() => skillsTable.create(this.db))
          .then(() => {
            const skills = hydrateSkillSeeds(
              skillSeeds, this.bankModel.cardByCardId)
            skillsTable.insertRows(this.db, skills.map(skillToRow))
          })
      }
    })

  _loadFromCardsTable = (): Promise<void> =>
    cardsTable.selectAll(this.db)
      .then((rows: Array<CardRow>) => {
        const cardByCardId: {[number]: Card} = {}
        for (const row of rows) {
          cardByCardId[row.cardId] = rowToCard(row, cardByCardId)
        }

        this.bankModel = {
          cardByCardId,
          parentCardsByCardId: {},
          skillByCardId: {},
        }
      })

  _loadFromSkillsTable = (): Promise<void> =>
    skillsTable.selectAll(this.db)
      .then((skillRows: Array<SkillRow>) => {
        const skillByCardId: {[number]: Skill} = {}
        for (const skillRow of skillRows) {
          skillByCardId[skillRow.cardId] =
            rowToSkill(skillRow, this.bankModel.cardByCardId)
        }

        const parentCardsByCardId: {[number]: Array<Card>} = {}
        for (const card of (Object.values(this.bankModel.cardByCardId): any)) {
          for (const childCard of card.getChildren()) {
            if (parentCardsByCardId[childCard.cardId] === undefined) {
              parentCardsByCardId[childCard.cardId] = []
            }
            parentCardsByCardId[childCard.cardId].push(card)
          }
        }

        this.bankModel = {
          ...this.bankModel,
          skillByCardId,
          parentCardsByCardId,
        }
      })

  exportDatabase = (): string => {
    const cards: Array<Card> = (Object.values(this.bankModel.cardByCardId): any)
    const cardsJson = JSON.stringify(cards.map(card => card.getExport()))
      .replace(/,{"type"/g, ',\n{"type"')

    const skills = (Object.values(this.bankModel.skillByCardId): any)
    const skillsJson = JSON.stringify(skills.map(skill => {
      const { card } = skill
      const { delay, endurance, lastTestAt, mnemonic } = skill
      return {
        cardType: card.constructor.name,
        cardKey: card.getKey(),
        delay,
        endurance,
        lastTestAt,
        mnemonic,
      }
    })).replace(/,{"cardType"/g, ',\n{"cardType"')

    return `Paste in src/cards/seeds/cardSeeds.js:\n\n${cardsJson}` +
      `\n\nPaste in src/cards/seeds/skillSeeds.js:\n\n${skillsJson}`
  }

  reseedDatabase = (
    cardSeeds: Array<CardSeed>,
    skillSeeds: Array<SkillSeed>,
  ): Promise<BankModel> =>
    cardsTable.drop(this.db)
      .then(() => skillsTable.drop(this.db))
      .then(() => this._initTables(cardSeeds, skillSeeds))
      .then(this._loadFromCardsTable)
      .then(this._loadFromSkillsTable)
      .then(() => this.bankModel)

  updateSkills = (baseUpdates: Array<SkillUpdate>): Promise<BankModel> => {
    const { parentCardsByCardId, skillByCardId } = this.bankModel

    const allUpdates = []
    for (const baseUpdate of baseUpdates) {
      allUpdates.push(baseUpdate)

      if (baseUpdate.delay !== undefined) {
        const parentCards = parentCardsByCardId[baseUpdate.cardId] || []
        for (const parent of parentCards) {
          let totalDelay = 0
          for (const sibling of parent.getChildren()) {
            if (sibling.cardId === baseUpdate.cardId) {
              totalDelay += baseUpdate.delay
            } else {
              totalDelay += skillByCardId[sibling.cardId].delay
            }
          }
          allUpdates.push({ cardId: parent.cardId, delay: totalDelay })
        }
      }
    }

    const newSkillByCardId = { ...this.bankModel.skillByCardId } // copy0
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