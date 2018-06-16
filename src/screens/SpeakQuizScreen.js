import React from 'react'
import { Speech } from 'expo'
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import type { Card } from '../model/Card'
import type { Exposure } from '../model/Exposure'
import Hourglass from '../components/Hourglass'
import type { Leaf } from '../model/Leaf'


type Props = {|
  card: Card,
  exposeLeafs: (exposures: Array<Exposure>) => void,
|}

type State = {|
  exposureByLeafId: {[number]: Exposure},
  secondsLeft: number,
  showMnemonic: boolean,
|}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
  },
  question: {
    flex: 1,
    justifyContent: 'center', // center vertically
    alignItems: 'center', // center horizontally
  },
  instructions: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 10,
  },
  hourglass: {
    marginRight: 10,
    marginTop: 10,
    marginLeft: 'auto', // float right
  },
  englishToTranslate: {
    fontVariant: ['small-caps'],
    fontSize: 40,
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
  forgotten: {
    color: 'red',
  },
  remembered: {
    color: 'green',
  },
})

export default class SpeakQuizScreen extends React.PureComponent<Props, State> {
  countdown: IntervalID
  timerStartedAt: Date

  constructor(props: Props) {
    super(props)
    this.timerStartedAt = new Date()
    this.state = {
      exposureByLeafId: {},
      secondsLeft: 3,
      showMnemonic: false,
    }
    this.setInterval()
  }

  componentWillUnmount() {
    clearInterval(this.countdown)
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.card !== prevProps.card) {
      this.timerStartedAt = new Date()
      this.setState({
        exposureByLeafId: {},
        secondsLeft: 3,
        showMnemonic: false,
      }, this.setInterval)
    }
  }

  setInterval() {
    if (this.countdown !== null) {
      clearInterval(this.countdown)
    }
    this.countdown = setInterval(() =>
      this.setState(prevState => {
        if (prevState.secondsLeft === 1) {
          clearInterval(this.countdown)
          this.speakSpanish(this.props.card.leafs)

          const exposureByLeafId = {}
          const createdAt = new Date().getTime() / 1000
          for (const leaf of this.props.card.leafs) {
            exposureByLeafId[leaf.leafId] = {
              exposureId: 0,
              leafId: leaf.leafId,
              createdAt,
              grade: 'FORGOTTEN',
              earlyDurationMs: null,
            }
          }

          return { exposureByLeafId, secondsLeft: 0 }
        } else {
          return { secondsLeft: prevState.secondsLeft - 1 }
        }
      }), 1000)
  }

  pressGlossTableRow = (leaf: Leaf) => {
    clearInterval(this.countdown)

    this.speakSpanish([leaf])

    this.setState(prevState => {
      let newExposure: Exposure
      const oldExposure = prevState.exposureByLeafId[leaf.leafId]
      if (oldExposure === undefined) {
        const nowMs = new Date().getTime()
        newExposure = {
          exposureId: 0,
          leafId: leaf.leafId,
          createdAt: nowMs / 1000,
          grade: 'EARLY',
          earlyDurationMs: nowMs - this.timerStartedAt,
        }
      } else {
        newExposure = {
          ...oldExposure,
          grade: oldExposure.grade === 'FORGOTTEN' ? 'REMEMBERED' : 'FORGOTTEN',
        }
      }

      return {
        exposureByLeafId: {
          ...prevState.exposureByLeafId,
          [leaf.leafId]: newExposure,
        },
        secondsLeft: 0,
      }
    })
  }

  onNext = () => {
    const exposures = (Object.values(this.state.exposureByLeafId): any)
    this.props.exposeLeafs(exposures)
  }

  speakSpanish = (leafs: Array<Leaf>) => {
    const es = leafs.map(leaf => leaf.es).join(' ').replace(/- -/g, '')
    Speech.speak(es, { language: 'es', rate: 0.5 })
  }

  render() {
    return <View style={styles.container}>
      <Text style={styles.instructions}>Tap word when you remember</Text>
      <View style={styles.gloss_table}>
        {this.props.card.leafs.map(leaf =>
          <TouchableOpacity
            key={leaf.leafId}
            onPress={() => this.pressGlossTableRow(leaf)}>
            <View style={styles.gloss_table_row}>
              <Text style={styles.gloss_table_english}>
                {this.state.secondsLeft > 0 && leaf.en.startsWith('(') ?
                  '' : leaf.en}
              </Text>
              {this.state.secondsLeft > 0 ?
                <View style={styles.hourglass}>
                  <Hourglass secondsLeft={this.state.secondsLeft} />
                </View> :
                <Text style={[
                  styles.gloss_table_spanish,
                  (this.state.exposureByLeafId[leaf.leafId] ||
                    { grade: 'REMEMBERED' }).grade !== 'FORGOTTEN' ?
                    styles.remembered : styles.forgotten,
                ]}>
                  {leaf.es}
                </Text>}
            </View>
          </TouchableOpacity>)}
      </View>

      <Button onPress={this.onNext} title='Next' />
    </View>
  }
}
