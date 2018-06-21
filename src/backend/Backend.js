import type { Card } from '../cards/Card'
import type { Skill } from '../cards/Skill'

const FETCH_TIMEOUT_MILLIS = 5000

type SkillExport = {|
  cardType: string,
  cardKey: string,
  mnemonic: string,
  delay: number,
  endurance: number,
  lastCorrectAt: number,
|}

export default class Backend {
  baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  downloadDatabase = ():
    Promise<{cards: Array<Card>, skills: Array<Skill>}> =>
    new Promise((resolve, reject) => {
      const timeout = setTimeout(
        () => reject(new Error(`Timeout from ${this.baseUrl}`)),
        FETCH_TIMEOUT_MILLIS
      )
      fetch(this.baseUrl)
        .then(response => {
          return response.text().then(text => {
            if (response.ok) {
              clearTimeout(timeout)
              try {
                console.log('Got text', text)
                const { cards, skills } = JSON.parse(text)
                resolve({ cards, skills })
              } catch (e) {
                console.error('Error parsing JSON', text, e)
                reject(e)
              }
            } else {
              reject(new Error(`Got status ${response.status} and text ${
                text} from ${this.baseUrl}`))
            }
          })
        })
    })

  uploadSkills = (skillExports: Array<SkillExport>): Promise<void> =>
    new Promise((resolve, reject) => {
      const timeout = setTimeout(
        () => reject(new Error(`Timeout from ${this.baseUrl}`)),
        FETCH_TIMEOUT_MILLIS
      )
      fetch(this.baseUrl, {
        body: JSON.stringify({ skillExports }),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(response => {
        return response.text().then(text => {
          clearTimeout(timeout)
          if (response.ok) {
            resolve()
          } else {
            reject(new Error(
              `Got status ${response.status} and response ${text} from ${
                this.baseUrl}`))
          }
        })
      })
    })
}