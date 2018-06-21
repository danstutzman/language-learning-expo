export const DELAY_THRESHOLD = 10000

export type Skill = {|
  cardId: number,
  mnemonic: string,

  // if recalled, delay = estimated milliseconds
  // if not recalled, delay = DELAY_THRESHOLD
  // if child is not recalled, delay > DELAY_THRESHOLD
  delay: number,

  // seconds between timestamp of 2nd last and last test; 0 if not two answers
  endurance: number,

  // if tested before and answered correctly: seconds since epoch for last test
  // if never tested or test was incorrect: zero
  lastCorrectAt: number,
|}