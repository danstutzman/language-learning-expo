import React from 'react'
import { Speech } from 'expo'
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import type { BankModel } from '../cards/BankModel'
import type { Card } from '../cards/Card'
import { DELAY_THRESHOLD } from '../cards/Skill'
import type { GlossRow } from '../cards/GlossRow'
import type { Skill } from '../cards/Skill'
import type { SkillUpdate } from '../db/SkillUpdate'

type Props = {|
  bankModel: BankModel,
  card: Card,
  skill: Skill,
  updateSkills: (Array<SkillUpdate>) => Promise<void>,
|}

type State = {|
  recalledByLeafCardId: {[number]: boolean},
  delay: number | null, // milliseconds to answer
|}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
  },
  cardEnglish: {
    fontVariant: ['small-caps'],
    fontSize: 40,
    marginTop: 10,
    alignSelf: 'center', // horizontal center
  },
  glossTable: {
    flex: 1,
    justifyContent: 'center', // center vertically
  },
  glossTableRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  glossTableEnglish: {
    fontVariant: ['small-caps'],
    fontSize: 40,
    marginLeft: 10,
  },
  glossTableSpanish: {
    fontSize: 40,
    fontStyle: 'italic',
    textAlign: 'right',
    marginRight: 10,
    marginLeft: 'auto', // float right
  },
  glossTableSpanishForgotten: {
    color: 'red',
  },
  glossTableSpanishRemembered: {
    color: 'green',
  },
})

function assertNotNull(value: number | null): number {
  if (value === null) {
    throw new Error('Unexpected null')
  }
  return value
}

export default class SpeakQuizScreen extends React.PureComponent<Props, State> {
  timerStartedAtMillis: number

  constructor(props: Props) {
    super(props)
    this.timerStartedAtMillis = new Date().getTime()
    this.state = { recalledByLeafCardId: {}, delay: null }
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.skill.cardId !== prevProps.skill.cardId) {
      this.timerStartedAtMillis = new Date().getTime()
      this.setState({ delay: null })
    }
  }

  revealAnswer = () => {
    const { glossRows } = this.props.card

    this.speakSpanish(glossRows)

    const recalledByLeafCardId = {}
    for (const glossRow of glossRows) {
      recalledByLeafCardId[glossRow.cardId] = true
    }

    this.setState({
      recalledByLeafCardId,
      delay: new Date().getTime() - this.timerStartedAtMillis,
    })
  }

  pressGlossTableRow = (glossRow: GlossRow) => {
    this.speakSpanish([glossRow])

    this.setState(prevState => ({
      recalledByLeafCardId: {
        ...prevState.recalledByLeafCardId,
        [glossRow.cardId]: !prevState.recalledByLeafCardId[glossRow.cardId],
      },
    }))
  }

  _gatherFailedSkillUpdates(card: Card) {
    const { recalledByLeafCardId } = this.state
    if (card.childrenCardIds.length === 0) {
      if (recalledByLeafCardId[card.cardId]) {
        return []
      } else {
        return [{
          cardId: card.cardId,
          delay: DELAY_THRESHOLD,
          endurance: 0,
        }]
      }
    } else {
      return card.childrenCardIds
        .map(childCardId => this._gatherFailedSkillUpdates(
          this.props.bankModel.cardByCardId[childCardId]))
        .reduce((accum, item) => accum.concat(item), [])
    }
  }

  onNext = () => {
    const { card, skill, updateSkills } = this.props
    const { recalledByLeafCardId, delay } = this.state
    const incorrectRows = card.glossRows.filter(glossRow =>
      !recalledByLeafCardId[glossRow.cardId])
    if (incorrectRows.length === 0) {
      let enduranceUpdate = {}
      if (skill.lastSeenAt !== 0 && skill.delay < DELAY_THRESHOLD) {
        const newEndurance = Math.floor(
          this.timerStartedAtMillis / 1000 - skill.lastSeenAt)
        if (newEndurance > skill.endurance) {
          enduranceUpdate = { endurance: newEndurance }
        }
      }

      updateSkills([{
        cardId: skill.cardId,
        delay: assertNotNull(delay),
        lastCorrectAt: Math.floor(this.timerStartedAtMillis / 1000),
        ...enduranceUpdate,
      }])
    } else {
      updateSkills(this._gatherFailedSkillUpdates(this.props.card))
    }
  }

  speakSpanish = (glossRows: Array<GlossRow>) => {
    const es = glossRows.map(glossRow =>
      glossRow.es).join(' ').replace(/- -/g, '')
    Speech.speak(es, { language: 'es', rate: 0.5 })
  }

  renderGlossTable() {
    return this.props.card.glossRows.map(glossRow => {
      const { cardId, en, es } = glossRow
      return <TouchableOpacity
        key={cardId}
        style={styles.glossTableRow}
        onPress={() => this.pressGlossTableRow(glossRow)}>
        <Text style={styles.glossTableEnglish}>{en}</Text>
        <Text style={[
          styles.glossTableSpanish,
          this.state.recalledByLeafCardId[cardId]
            ? styles.glossTableSpanishRemembered
            : styles.glossTableSpanishForgotten,
        ]}>{es}</Text>
      </TouchableOpacity>
    })
  }

  render() {
    return <View style={styles.container}>
      <Text style={styles.cardEnglish}>
        {this.props.card.quizQuestion}
      </Text>
      <View style={styles.glossTable}>
        {this.state.delay === null
          ? <Button
            onPress={this.revealAnswer}
            title='Tap here when you remember' />
          : this.renderGlossTable()}
      </View>
      <Button onPress={this.onNext} title='Next' />
    </View>
  }
}