import type { ExposureGrade } from './ExposureGrade'

export type ExposureExport = {|
  leafEs: string,
  createdAt: number,
  grade: ExposureGrade,
  earlyDurationMs: number | null,
|}

export default (
  // Paste the JSON from the export email below the comment below:
  // eslint-disable-next-line quotes
  [{"leafEs":"piel","createdAt":1529181589.961,"grade":"EARLY","earlyDurationMs":2101},{"leafEs":"brazo","createdAt":1529181630.193,"grade":"FORGOTTEN","earlyDurationMs":null},{"leafEs":"pierna","createdAt":1529181642.461,"grade":"REMEMBERED","earlyDurationMs":null}]
: Array<ExposureExport>)
