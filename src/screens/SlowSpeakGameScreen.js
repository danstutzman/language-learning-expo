import { Speech } from 'expo'
import React from 'react'
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'

import type { Exposure } from '../model/Exposure'
import type { Leaf } from '../model/Leaf'
import Hourglass from '../components/Hourglass'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  en: {
    marginTop: 30,
    fontVariant: ['small-caps'],
    fontSize: 40,
  },
  hourglass: {
    marginTop: 30,
  },
  answer: {
    alignItems: 'center',
    padding: 10,
  },
  gradeEarly: {
    borderColor: 'green',
    borderWidth: 10,
  },
  gradeRemembered: {
    borderColor: 'green',
    borderWidth: 3,
  },
  gradeForgotten: {
    borderColor: 'red',
    borderWidth: 3,
  },
  mnemonic: {
    marginTop: 30,
    fontSize: 20,
    backgroundColor: '#eee',
    padding: 10,
  },
  es: {
    marginTop: 30,
    fontSize: 40,
    fontStyle: 'italic',
  },
})

export type Props = {|
  leaf: Leaf,
  exposeLeafs: (exposures: Array<Exposure>) => void,
  editMnemonic: (mnemonic: string) => void,
|}

export type State = {|
  exposure: Exposure | null,
  newMnemonic: string | null,
  secondsLeft: number,
|}

const GRADE_TO_STYLE = {
  'EARLY': styles.gradeEarly,
  'REMEMBERED': styles.gradeRemembered,
  'FORGOTTEN': styles.gradeForgotten,
}

export default class SlowSpeakGameScreen
  extends React.PureComponent<Props, State> {
  countdown: IntervalID
  timerStartedAt: Date

  constructor(props: Props) {
    super(props)
    this.timerStartedAt = new Date()
    this.state = {
      exposure: null,
      newMnemonic: null,
      secondsLeft: 3,
    }
    this.setInterval()
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.leaf.leafId !== prevProps.leaf.leafId) {
      this.timerStartedAt = new Date()
      this.setState({
        exposure: null,
        newMnemonic: null,
        secondsLeft: 3,
      }, this.setInterval)
    }
  }

  componentWillUnmount() {
    clearInterval(this.countdown)
  }

  setInterval() {
    if (this.countdown !== null) {
      clearInterval(this.countdown)
    }
    this.countdown = setInterval(() =>
      this.setState(prevState => {
        if (prevState.secondsLeft === 1) {
          clearInterval(this.countdown)
          this.speakMnemonicAndSpanish()
          return {
            secondsLeft: 0,
            exposure: {
              exposureId: 0,
              leafId: this.props.leaf.leafId,
              createdAt: new Date().getTime() / 1000,
              grade: 'FORGOTTEN',
              earlyDurationMs: null,
            },
          }
        } else {
          return { secondsLeft: prevState.secondsLeft - 1 }
        }
      }), 1000)
  }

  speakMnemonicAndSpanish() {
    const { es, mnemonic } = this.props.leaf
    if (mnemonic !== '') {
      Speech.speak(mnemonic, { language: 'en', onDone: () =>
        Speech.speak(es, { language: 'es', rate: 0.5 })
      })
    } else {
      Speech.speak(es, { language: 'es', rate: 0.5 })
    }
  }

  toggleRemembered = () => {
    clearInterval(this.countdown)
    this.setState(prevState => {
      const nowMs = new Date().getTime() // milliseconds since epoch
      if (prevState.exposure === null) {
        return {
          exposure: {
            exposureId: 0,
            leafId: this.props.leaf.leafId,
            createdAt: nowMs / 1000,
            grade: 'EARLY',
            earlyDurationMs: nowMs - this.timerStartedAt.getTime(),
          },
          secondsLeft: 0,
        }
      } else {
        return {
          exposure: {
            ...prevState.exposure,
            grade: prevState.exposure.grade === 'FORGOTTEN' ?
              'REMEMBERED' : 'FORGOTTEN',
          },
        }
      }
    })
    this.speakMnemonicAndSpanish()
  }

  pressNext = () => {
    Speech.stop()

    const { exposure } = this.state
    if (exposure === null) {
      throw new Error('Exposure supposed to be set before next button shown')
    }
    this.props.exposeLeafs([exposure])
  }

  render() {
    const { leaf } = this.props
    return <View style={styles.container}>
      <Text style={styles.en}>{leaf.en}</Text>

      <TouchableOpacity
        style={styles.hourglass}
        onPress={this.toggleRemembered}>
        {this.state.secondsLeft > 0 ?
          <Hourglass secondsLeft={this.state.secondsLeft} /> :
          <View style={[styles.answer, GRADE_TO_STYLE[
            (this.state.exposure || { grade: 'FORGOTTEN' }).grade]]}>
            <TextInput
              style={styles.mnemonic}
              multiline={true}
              returnKeyType="done"
              blurOnSubmit={true} // makes Return submit instead of insert LF
              onChangeText={(newMnemonic: string) =>
                this.setState({ newMnemonic })}
              onSubmitEditing={() =>
                this.props.editMnemonic(this.state.newMnemonic || '')}
              value={this.state.newMnemonic !== null ?
                this.state.newMnemonic : leaf.mnemonic} />
            <Text style={styles.es}>{leaf.es}</Text>
          </View>}
      </TouchableOpacity>

      {this.state.secondsLeft === 0 &&
        <Button onPress={this.pressNext} title="Next" />}
    </View>
  }
}