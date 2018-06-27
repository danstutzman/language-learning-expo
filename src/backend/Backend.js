import type { Card } from '../cards/Card'

const FETCH_TIMEOUT_MILLIS = 5000

type CardUpload = {|
  leafIds: Array<number>,
  mnemonic: string,
  stage: number,
  lastSeenAt: number,
|}

export default class Backend {
  baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  downloadDatabase = (): Promise<{cards: Array<Card>}> =>
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
                const { cardDownloads } = JSON.parse(text)
                resolve({ cards: cardDownloads })
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

  uploadCards = (cards: Array<Card>): Promise<void> =>
    new Promise((resolve, reject) => {
      const timeout = setTimeout(
        () => reject(new Error(`Timeout from ${this.baseUrl}`)),
        FETCH_TIMEOUT_MILLIS
      )
      fetch(this.baseUrl, {
        body: JSON.stringify({ cards }),
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