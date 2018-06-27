export const STAGE0_NOT_READY_TO_TEST = 0
export const STAGE1_READY_TO_TEST = 1
export const STAGE2_WRONG = 2
export const STAGE3_SLOW = 3
export const STAGE4_PASSED = 4
export const STAGE5_SAME_AS_ENGLISH = 5

export const ALL_STAGES = [0, 1, 2, 3, 4, 5]

export const STAGE_TO_DESCRIPTION = {
  '0': 'Not ready to test',
  '1': 'Ready to test',
  '2': 'Wrong',
  '3': 'Slow',
  '4': 'Passed',
  '5': 'Same as English'
}