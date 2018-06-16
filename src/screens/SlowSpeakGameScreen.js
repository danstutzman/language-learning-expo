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
  answerRemembered: {
    borderColor: 'green',
    borderWidth: 3,
  },
  answerForgotten: {
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
  exposeLeaf: (remembered: boolean) => void,
  editMnemonic: (mnemonic: string) => void,
|}

export type State = {|
  newMnemonic: string | null,
  remembered: boolean,
  secondsLeft: number,
|}

export default class SlowSpeakGameScreen
  extends React.PureComponent<Props, State> {
  countdown: IntervalID

  constructor(props: Props) {
    super(props)
    this.state = {
      newMnemonic: null,
      remembered: false,
      secondsLeft: 3,
    }
    this.setInterval()
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.leaf.leafId !== prevProps.leaf.leafId) {
      this.setState({
        newMnemonic: null,
        remembered: false,
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
          return { secondsLeft: 0 }
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
    this.setState(prevState => ({
      secondsLeft: 0,
      remembered: !prevState.remembered,
    }))
    this.speakMnemonicAndSpanish()
  }

  pressNext = () => {
    if (this.state.newMnemonic !== null) {
      this.props.editMnemonic(this.state.newMnemonic)
    }
    this.props.exposeLeaf(this.state.remembered)
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
          <View style={[
            styles.answer,
            this.state.remembered ?
              styles.answerRemembered : styles.answerForgotten,
          ]}>
            <TextInput
              style={[styles.mnemonic, this.state.remembered || styles.forgotten]}
              onChangeText={(newMnemonic: string) =>
                this.setState({ newMnemonic })}
              value={this.state.newMnemonic !== null ?
                this.state.newMnemonic : leaf.mnemonic} />
            <Text style={[styles.es, this.state.remembered || styles.forgotten]}>
              {leaf.es}
            </Text>
          </View>}
      </TouchableOpacity>

      {this.state.secondsLeft === 0 &&
        <Button onPress={this.pressNext} title="Next" />}
    </View>
  }
}