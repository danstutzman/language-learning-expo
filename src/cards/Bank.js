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
      assertString(content.en),
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

  const { mnemonic, delay, endurance } = row
  return { card, mnemonic, delay, endurance }
}

export function cardToRow(card: Card): CardRow {
  return {
    cardId: card.cardId,
    type: assertCardType(card.constructor.name),
    contentJson: card.getContentJson(),
  }
}

export function skillToRow(skill: Skill): SkillRow {
  const { mnemonic, delay, endurance } = skill
  return {
    cardId: skill.card.cardId,
    mnemonic,
    delay,
    endurance,
  }
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
        this.bankModel = {
          cardByCardId: {},
          skills: [],
        }
        const { cardByCardId } = this.bankModel
        for (const row of rows) {
          this.bankModel.cardByCardId[row.cardId] = rowToCard(row, cardByCardId)
        }
      })

  _loadFromSkillsTable = (): Promise<void> =>
    skillsTable.selectAll(this.db)
      .then((skillRows: Array<SkillRow>) => {
        this.bankModel.skills = skillRows.map(skillRow =>
          rowToSkill(skillRow, this.bankModel.cardByCardId))
      })

  // addCard = (card: Card): Promise<void> =>
  //   cardsTable.insertRow(this.db, card)
  //     .then(card => this.cardByCardId[card.cardId] = card)

  // deleteCard = (card: Card): Promise<void> =>
  //   cardsTable.deleteRow(this.db, card)
  //     .then(() => delete this.cardByCardId[card.cardId])

  // editCard = (card: Card): Promise<void> =>
  //   cardsTable.updateRow(this.db, card)
  //     .then(() => this.cardByCardId[card.cardId] = card)

  exportDatabase = (): string => {
    const cards: Array<Card> = (Object.values(this.bankModel.cardByCardId): any)
    const cardsJson = JSON.stringify(cards.map(card => card.getExport()))
      .replace(/,{"type"/g, ',\n{"type"')

    return `Paste in src/cards/cardSeeds.js:\n\n${cardsJson}`
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
}