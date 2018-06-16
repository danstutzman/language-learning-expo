import type { ExposureGrade } from './ExposureGrade'

export type Exposure = {|
  exposureId: number,
  leafId: number,
  createdAt: number, // seconds since epoch
  grade: ExposureGrade,
  earlyDurationMs: number | null, // milliseconds to respond, null if not EARLY
|}