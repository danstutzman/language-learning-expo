export type ExposureType = 'RECALLED_ES' | 'DIDNT_RECALL_ES' | 'SAW'

export function assertExposureType(value: any): ExposureType {
  if (value !== 'RECALLED_ES' &&
  value !== 'DIDNT_RECALL_ES' &&
  value !== 'SAW') {
    throw new Error(`Unexpected ExposureType ${value}`)
  }
  return value
}