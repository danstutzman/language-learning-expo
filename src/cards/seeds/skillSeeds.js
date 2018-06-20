/* eslint-disable */
import type { CardType } from '../enums/CardType'
import { DELAY_THRESHOLD } from '../Skill'

export type SkillSeed = {
  cardType: CardType,
  cardKey: string,
  mnemonic: string,
  delay: number,
  lastTestAt: number,
  endurance: number,
}

export default (

// Paste seeds replacing the following line(s):
[{"cardType":"Inf","cardKey":"preguntar","delay":926,"endurance":0,"lastTestAt":1529511327.906,"mnemonic":""},
{"cardType":"Inf","cardKey":"comer","delay":10000,"endurance":0,"lastTestAt":0,"mnemonic":""},
{"cardType":"RegVPattern","cardKey":"AR11PRES","delay":10000,"endurance":0,"lastTestAt":0,"mnemonic":""},
{"cardType":"RegVPattern","cardKey":"AR13PRES","delay":10000,"endurance":0,"lastTestAt":0,"mnemonic":""},
{"cardType":"RegVPattern","cardKey":"ER11PRES","delay":10000,"endurance":0,"lastTestAt":0,"mnemonic":""},
{"cardType":"RegVPattern","cardKey":"ER13PRES","delay":10000,"endurance":0,"lastTestAt":0,"mnemonic":""},
{"cardType":"RegVPattern","cardKey":"AR11PRET","delay":10000,"endurance":0,"lastTestAt":0,"mnemonic":""},
{"cardType":"RegVPattern","cardKey":"AR13PRET","delay":10000,"endurance":0,"lastTestAt":0,"mnemonic":""},
{"cardType":"RegV","cardKey":"preguntarAR11PRES","delay":10926,"endurance":0,"lastTestAt":0,"mnemonic":""},
{"cardType":"RegV","cardKey":"preguntarAR13PRES","delay":10926,"endurance":0,"lastTestAt":0,"mnemonic":""},
{"cardType":"RegV","cardKey":"comerER11PRES","delay":20000,"endurance":0,"lastTestAt":0,"mnemonic":""},
{"cardType":"RegV","cardKey":"comerER13PRES","delay":20000,"endurance":0,"lastTestAt":0,"mnemonic":""},
{"cardType":"RegV","cardKey":"preguntarAR11PRET","delay":10926,"endurance":0,"lastTestAt":0,"mnemonic":""},
{"cardType":"RegV","cardKey":"preguntarAR13PRET","delay":10926,"endurance":0,"lastTestAt":0,"mnemonic":""}]

.map((partialSeed: any) => {
  const {
    cardType,
    cardKey,
    mnemonic,
    delay,
    lastTestAt,
    endurance,
  } = partialSeed
  const defaultDelay = (cardType === 'RegV') ?
    DELAY_THRESHOLD * 2 : DELAY_THRESHOLD
  return {
    cardType,
    cardKey,
    mnemonic: mnemonic || '',
    delay: delay || defaultDelay,
    lastTestAt: lastTestAt || 0,
    endurance: endurance || 0,
  }
}): Array<SkillSeed>)