export type ExposureExport = {|
  cardEs: string,
  remembered: boolean,
  createdAtSeconds: number,
|}

export default (
  // Paste the JSON from the export email below the comment below:
  // eslint-disable-next-line quotes
  [{"cardEs":"garganta","remembered":true,"createdAtSeconds":1529083475.152}]
: Array<ExposureExport>)