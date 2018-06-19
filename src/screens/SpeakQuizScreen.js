import React from 'react'
import { Speech } from 'expo'
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import type { LeafCard } from '../cards/LeafCard'
import type { Skill } from '../cards/Skill'

type Props = {|
  skill: Skill,
|}

type State = {|
  // recalledByLeafId: {[number]: boolean},
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
    // this.state = { recalledByLeafId: {}, recalledAtMillis: null }
    this.state = { delay: null }
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.skill.card.cardId !== prevProps.skill.card.cardId) {
      this.timerStartedAtMillis = new Date().getTime()
      this.setState({ delay: null })
    }
  }

  revealAnswer = () => {
    // const recalledByLeafId = {}
    // for (const leaf of this.props.card.getLeafs()) {
    //   recalledByLeafId[leaf.leafId] = true
    // }

    // this.setState({
    //   recalledByLeafId,
    //   recalledAtMillis: new Date().getTime(),
    // })
  }

  pressGlossTableRow = (leaf: LeafCard) => {
    this.speakSpanish([leaf])

    // this.setState(prevState => ({
    //   recalledByLeafId: {
    //     ...prevState.recalledByLeafId,
    //     [leaf.leafId]: !prevState.recalledByLeafId[leaf.leafId],
    //   },
    // }))
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

  speakSpanish = (leafs: Array<LeafCard>) => {
    const es = leafs.map(leaf => leaf.es).join(' ').replace(/- -/g, '')
    Speech.speak(es, { language: 'es', rate: 0.5 })
  }

  renderGlossTable() {
    return this.props.skill.card.getLeafCards().map(leafCard =>
      <TouchableOpacity
        key={leafCard.cardId}
        style={styles.glossTableRow}
        onPress={() => this.pressGlossTableRow(leafCard)}>
        <Text style={styles.glossTableEnglish}>{leafCard.getGloss()}</Text>
        <Text style={[styles.glossTableSpanish]}>
          {leafCard.es}
        </Text>
      </TouchableOpacity>
    )
  }

  render() {
    return <View style={styles.container}>
      <Text style={styles.cardEnglish}>
        {this.props.skill.card.getLeafCards().map(leafCard =>
          leafCard.getGloss()).join(' ')}
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