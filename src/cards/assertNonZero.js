export default function assertNonZero(value: number): number {
  if (value === 0) {
    throw new Error(`Expected non-zero but got ${value}`)
  }
  return value
}