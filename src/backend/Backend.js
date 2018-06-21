import type { Card } from '../cards/Card'
import type { Skill } from '../cards/Skill'

export default class Backend {
  baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  downloadDatabase = ():
    Promise<{cards: Array<Card>, skills: Array<Skill>}> => {
    console.log('Fetching', this.baseUrl)
    return fetch(this.baseUrl)
      .then(response => {
        return response.text().then(text => {
          try {
            const { cards, skills } = JSON.parse(text)
            return { cards, skills }
          } catch (e) {
            console.error('Error parsing JSON', text, e)
            throw e
          }
        })
      })
  }
}