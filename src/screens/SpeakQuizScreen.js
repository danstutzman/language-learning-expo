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
import type { CardUpdate } from '../cards/CardUpdate'
import type { GlossRow } from '../cards/GlossRow'
import { STAGE2_WRONG } from '../cards/Stage'
import { STAGE3_PASSED } from '../cards/Stage'

type Props = {|
  bankModel: BankModel,
  card: Card,
  updateCards: (Array<CardUpdate>) => Promise<void>,
|}

type State = {|
  recalledByLeafId: {[number]: boolean},
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

export default class SpeakQuizScreen extends React.PureComponent<Props, State> {
  timerStartedAtMillis: number

  constructor(props: Props) {
    super(props)
    this.timerStartedAtMillis = new Date().getTime()
    this.state = { recalledByLeafId: {}, delay: null }
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.card.cardId !== prevProps.card.cardId) {
      this.timerStartedAtMillis = new Date().getTime()
      this.setState({ delay: null })
    }
  }

  revealAnswer = () => {
    const { glossRows } = this.props.card

    this.speakSpanish(glossRows)

    const recalledByLeafId = {}
    for (const glossRow of glossRows) {
      recalledByLeafId[glossRow.leafId] = true
    }

    this.setState({
      recalledByLeafId,
      delay: new Date().getTime() - this.timerStartedAtMillis,
    })
  }

  pressGlossTableRow = (glossRow: GlossRow) => {
    this.speakSpanish([glossRow])

    this.setState(prevState => ({
      recalledByLeafId: {
        ...prevState.recalledByLeafId,
        [glossRow.leafId]: !prevState.recalledByLeafId[glossRow.leafId],
      },
    }))
  }

  onNext = () => {
    const { bankModel, card, updateCards } = this.props
    const { recalledByLeafId, delay } = this.state
    const incorrectRows = card.glossRows.filter(glossRow =>
      !recalledByLeafId[glossRow.leafId])
    const lastSeenAt = Math.floor(this.timerStartedAtMillis / 1000)
    if (incorrectRows.length === 0) {
      updateCards([{
        cardId: card.cardId,
        lastSeenAt,
        stage: STAGE3_PASSED,
      }])
    } else {
      updateCards(incorrectRows.map(glossRow => ({
        cardId: bankModel.leafIdToLeafCardId[glossRow.leafId],
        lastSeenAt,
        stage: STAGE2_WRONG,
      })))
    }
  }

  speakSpanish = (glossRows: Array<GlossRow>) => {
    const es = glossRows.map(glossRow =>
      glossRow.es).join(' ').replace(/- -/g, '')
    Speech.speak(es, { language: 'es', rate: 0.5 })
  }

  renderGlossTable() {
    return this.props.card.glossRows.map(glossRow => {
      const { leafId, en, es } = glossRow
      return <TouchableOpacity
        key={leafId}
        style={styles.glossTableRow}
        onPress={() => this.pressGlossTableRow(glossRow)}>
        <Text style={styles.glossTableEnglish}>{en}</Text>
        <Text style={[
          styles.glossTableSpanish,
          this.state.recalledByLeafId[leafId]
            ? styles.glossTableSpanishRemembered
            : styles.glossTableSpanishForgotten,
        ]}>{es}</Text>
      </TouchableOpacity>
    })
  }

  render() {
    return <View style={styles.container}>
      <Text style={styles.cardEnglish}>
        {this.props.card.prompt}
      </Text>
      <View style={styles.glossTable}>
        {this.state.delay === null
          ? <Button
            onPress={this.revealAnswer}
            title='I remember' />
          : this.renderGlossTable()}
      </View>
      <Button
        onPress={this.onNext}
        title={this.state.delay === 0 ? 'I forget' : 'Next card'} />
    </View>
  }
}