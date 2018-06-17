import type { ExposureType } from './ExposureType'

export type Exposure = {|
  exposureId: number,
  type: ExposureType,
  leafIds: Array<number>,
  createdAt: number, // seconds since epoch

  // milliseconds for answer (if type is RECALLED_ES); otherwise null
  recallMillis: number | null,
|}