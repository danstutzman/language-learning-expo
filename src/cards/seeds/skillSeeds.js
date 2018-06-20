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
[{"cardType":"Inf","cardKey":"preguntar","delay":1096,"endurance":154,"lastTestAt":1529511482.29,"mnemonic":""},
{"cardType":"Inf","cardKey":"comer","delay":2184,"endurance":0,"lastTestAt":1529512433.62,"mnemonic":""},
{"cardType":"RegVPattern","cardKey":"AR11PRES","delay":4389,"endurance":0,"lastTestAt":1529512441.299,"mnemonic":""},
{"cardType":"RegVPattern","cardKey":"AR13PRES","delay":6026,"endurance":0,"lastTestAt":1529512484.567,"mnemonic":""},
{"cardType":"RegVPattern","cardKey":"ER11PRES","delay":4836,"endurance":0,"lastTestAt":1529512590.662,"mnemonic":""},
{"cardType":"RegVPattern","cardKey":"ER13PRES","delay":3218,"endurance":0,"lastTestAt":1529512607.971,"mnemonic":""},
{"cardType":"RegVPattern","cardKey":"AR11PRET","delay":7363,"endurance":0,"lastTestAt":1529512741.012,"mnemonic":""},
{"cardType":"RegVPattern","cardKey":"AR13PRET","delay":2910,"endurance":0,"lastTestAt":1529512753.254,"mnemonic":""},
{"cardType":"RegV","cardKey":"preguntarAR11PRES","delay":2065,"endurance":0,"lastTestAt":1529512764.598,"mnemonic":""},
{"cardType":"RegV","cardKey":"preguntarAR13PRES","delay":1537,"endurance":0,"lastTestAt":1529512769.89,"mnemonic":""},
{"cardType":"RegV","cardKey":"comerER11PRES","delay":1264,"endurance":0,"lastTestAt":1529512774.401,"mnemonic":""},
{"cardType":"RegV","cardKey":"comerER13PRES","delay":1101,"endurance":0,"lastTestAt":1529512778.916,"mnemonic":""},
{"cardType":"RegV","cardKey":"preguntarAR11PRET","delay":1654,"endurance":0,"lastTestAt":1529512783.863,"mnemonic":""},
{"cardType":"RegV","cardKey":"preguntarAR13PRET","delay":1413,"endurance":0,"lastTestAt":1529512788.423,"mnemonic":""},
{"cardType":"NP","cardKey":"yo","delay":0,"endurance":0,"lastTestAt":0,"mnemonic":""},
{"cardType":"IClause","cardKey":"agent=yo v=comerER11PRES","delay":0,"endurance":0,"lastTestAt":0,"mnemonic":""}]

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