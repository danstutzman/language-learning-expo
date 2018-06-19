import React from 'react'
import { Speech } from 'expo'
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import type { GlossRow } from '../cards/GlossRow'
import type { Skill } from '../cards/Skill'

type Props = {|
  skill: Skill,
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
})

export default class SpeakQuizScreen extends React.PureComponent<Props, State> {
  timerStartedAtMillis: number

  constructor(props: Props) {
    super(props)
    this.timerStartedAtMillis = new Date().getTime()
    this.state = { recalledByLeafCardId: {}, delay: null }
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.skill.card.cardId !== prevProps.skill.card.cardId) {
      this.timerStartedAtMillis = new Date().getTime()
      this.setState({ delay: null })
    }
  }

  revealAnswer = () => {
    const recalledByLeafCardId = {}
    for (const leafCard of this.props.skill.card.getGlossRows()) {
      recalledByLeafCardId[leafCard.cardId] = true
    }

    this.setState({
      recalledByLeafCardId,
      delay: new Date().getTime(),
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

  onNext = () => {
    // const { recalledByLeafId, recalledAtMillis } = this.state
    // const allLeafIds = this.props.card.getLeafs().map(leaf => leaf.leafId)
    // const nonRecalledLeafIds =
    //   allLeafIds.filter(leafId => !recalledByLeafId[leafId])

    // let type: ExposureType
    // let leafIds: Array<number>
    // let delay: number | null
    // if (recalledAtMillis === null) {
    //   type = 'DIDNT_RECALL_ES'
    //   leafIds = allLeafIds
    //   delay = null
    // } else if (nonRecalledLeafIds.length === 0) {
    //   type = 'RECALLED_ES'
    //   leafIds = allLeafIds
    //   delay = recalledAtMillis - this.timerStartedAtMillis
    // } else {
    //   type = 'DIDNT_RECALL_ES'
    //   leafIds = nonRecalledLeafIds
    //   delay = null
    // }

    // this.props.addExposures([{
    //   exposureId: 0,
    //   type,
    //   leafIds,
    //   createdAt: this.timerStartedAtMillis / 1000,
    //   delay,
    // }])
  }

  speakSpanish = (glossRows: Array<GlossRow>) => {
    const es = glossRows.map(glossRow =>
      glossRow.es).join(' ').replace(/- -/g, '')
    Speech.speak(es, { language: 'es', rate: 0.5 })
  }

  renderGlossTable() {
    return this.props.skill.card.getGlossRows().map(glossRow => {
      const { cardId, en, es } = glossRow
      return <TouchableOpacity
        key={cardId}
        style={styles.glossTableRow}
        onPress={() => this.pressGlossTableRow(glossRow)}>
        <Text style={styles.glossTableEnglish}>{en}</Text>
        <Text style={[styles.glossTableSpanish]}>{es}</Text>
      </TouchableOpacity>
    })
  }

  render() {
    return <View style={styles.container}>
      <Text style={styles.cardEnglish}>
        {this.props.skill.card.getQuizQuestion()}
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