import React from 'react'
import { Speech } from 'expo'
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import type { Card } from '../bank/Card'
import type { Exposure } from '../model/Exposure'
import type { ExposureType } from '../model/ExposureType'
import type { Leaf } from '../model/Leaf'

type Props = {|
  card: Card,
  addExposures: (exposures: Array<Exposure>) => void,
|}

type State = {|
  recalledByLeafId: {[number]: boolean},
  recalledAtMillis: number | null,
|}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
  },
  leaf_english: {
    fontVariant: ['small-caps'],
    fontSize: 40,
    marginTop: 10,
    alignSelf: 'center', // horizontal center
  },
  gloss_table: {
    flex: 1,
    justifyContent: 'center', // center vertically
  },
  gloss_table_row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gloss_table_english: {
    fontVariant: ['small-caps'],
    fontSize: 40,
    marginLeft: 10,
  },
  gloss_table_spanish: {
    fontSize: 40,
    fontStyle: 'italic',
    textAlign: 'right',
    marginRight: 10,
    marginLeft: 'auto', // float right
  },
  not_recalled: {
    color: 'red',
  },
  recalled: {
    color: 'green',
  },
})

export default class SpeakQuizScreen extends React.PureComponent<Props, State> {
  timerStartedAtMillis: number

  constructor(props: Props) {
    super(props)
    this.timerStartedAtMillis = new Date().getTime()
    this.state = { recalledByLeafId: {}, recalledAtMillis: null }
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.card !== prevProps.card) {
      this.timerStartedAtMillis = new Date().getTime()
      this.setState({ recalledByLeafId: {}, recalledAtMillis: null })
    }
  }

  revealAnswer = () => {
    const recalledByLeafId = {}
    for (const leaf of this.props.card.leafs) {
      recalledByLeafId[leaf.leafId] = true
    }

    this.setState({
      recalledByLeafId,
      recalledAtMillis: new Date().getTime(),
    })
  }

  pressGlossTableRow = (leaf: Leaf) => {
    this.speakSpanish([leaf])

    this.setState(prevState => ({
      recalledByLeafId: {
        ...prevState.recalledByLeafId,
        [leaf.leafId]: !prevState.recalledByLeafId[leaf.leafId],
      },
    }))
  }

  onNext = () => {
    const { recalledByLeafId, recalledAtMillis } = this.state
    const allLeafIds = this.props.card.leafs.map(leaf => leaf.leafId)
    const nonRecalledLeafIds =
      allLeafIds.filter(leafId => !recalledByLeafId[leafId])

    let type: ExposureType
    let leafIds: Array<number>
    let recallMillis: number | null
    if (recalledAtMillis === null) {
      type = 'DIDNT_RECALL_ES'
      leafIds = allLeafIds
      recallMillis = null
    } else if (nonRecalledLeafIds.length === 0) {
      type = 'RECALLED_ES'
      leafIds = allLeafIds
      recallMillis = recalledAtMillis - this.timerStartedAtMillis
    } else {
      type = 'DIDNT_RECALL_ES'
      leafIds = nonRecalledLeafIds
      recallMillis = null
    }

    this.props.addExposures([{
      exposureId: 0,
      type,
      leafIds,
      createdAt: this.timerStartedAtMillis / 1000,
      recallMillis,
    }])
  }

  speakSpanish = (leafs: Array<Leaf>) => {
    const es = leafs.map(leaf => leaf.es).join(' ').replace(/- -/g, '')
    Speech.speak(es, { language: 'es', rate: 0.5 })
  }

  renderGlossTable() {
    return this.props.card.leafs.map(leaf =>
      <TouchableOpacity
        key={leaf.leafId}
        style={styles.gloss_table_row}
        onPress={() => this.pressGlossTableRow(leaf)}>
        <Text style={styles.gloss_table_english}>{leaf.en}</Text>
        <Text style={[
          styles.gloss_table_spanish,
          this.state.recalledByLeafId[leaf.leafId] ?
            styles.recalled : styles.not_recalled,
        ]}>
          {leaf.es}
        </Text>
      </TouchableOpacity>
    )
  }

  render() {
    return <View style={styles.container}>
      <Text style={styles.leaf_english}>
        {this.props.card.leafs.map(leaf => leaf.en).join(' ')}
      </Text>
      <View style={styles.gloss_table}>
        {this.state.recalledAtMillis === null
          ? <Button
            onPress={this.revealAnswer}
            title='Tap here when you remember' />
          : this.renderGlossTable()}
      </View>
      <Button onPress={this.onNext} title='Next' />
    </View>
  }
}