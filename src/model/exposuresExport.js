import type { ExposureType } from './ExposureType'

export type ExposureExport = {|
  type: ExposureType,
  leafEss: Array<string>,
  createdAt: number,
  recallMillis: number | null,
|}

export default (
  // Paste the JSON from the export email below the comment below:
  // eslint-disable-next-line quotes
  []
: Array<ExposureExport>)
