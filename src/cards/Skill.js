import type { Card } from './Card'

export type Skill = {|
  card: Card,
  mnemonic: string,
  delay: number,
  endurance: number,
|}