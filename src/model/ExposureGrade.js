export type ExposureGrade = 'EARLY' | 'REMEMBERED' | 'FORGOTTEN'

export function assertExposureGrade(value: any): ExposureGrade {
  if (value !== 'EARLY' && value !== 'REMEMBERED' && value !== 'FORGOTTEN') {
    throw new Error(`Unexpected ExposureGrade ${value}`)
  }
  return value
}