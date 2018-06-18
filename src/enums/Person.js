export type Person = 1 | 2 | 3

export const PERSON_TO_DESCRIPTION: {[string]: string} = {
  '1': '1st',
  '2': '2nd',
  '3': '3rd',
}

export function assertPerson(value: any): Person {
  if (value !== 1 && value !== 2 && value !== 3) {
    throw new Error(`Unknown person ${value}`)
  }
  return (value: any)
}
