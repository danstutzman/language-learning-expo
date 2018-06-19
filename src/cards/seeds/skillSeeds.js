import type { CardType } from '../enums/CardType'

export type SkillSeed = {|
  cardType: CardType,
  cardKey: string,
  mnemonic: string,
|}

export default ([
  { cardType: 'Inf',
    cardKey: 'preguntar',
    mnemonic: '',
  },
  { cardType: 'RegVPattern',
    cardKey: 'AR11PRES',
    mnemonic: '',
  },
  { cardType: 'RegV',
    cardKey: 'preguntarAR11PRES',
    mnemonic: '',
  },
]: Array<SkillSeed>)