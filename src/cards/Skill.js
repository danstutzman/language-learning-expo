import type { Card } from './Card'

export const DELAY_THRESHOLD = 10000

export type Skill = {|
  card: Card,
  cardId: number,
  mnemonic: string,

  // if recalled, delay = estimated milliseconds
  // if not recalled, delay = DELAY_THRESHOLD
  // if child is not recalled, delay > DELAY_THRESHOLD
  delay: number,

  // seconds between timestamp of 2nd last and last test; 0 if not two answers
  endurance: number,

  // if tested before, seconds since epoch for last test
  // if never tested, zero
  lastTestAt: number,
|}