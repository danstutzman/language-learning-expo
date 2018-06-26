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

import type { Card } from '../cards/Card'
import type { CardUpdate } from '../cards/CardUpdate'
import { STAGE2_WRONG } from '../cards/Stage'
import { STAGE3_PASSED } from '../cards/Stage'

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
  answer: {
    alignItems: 'center',
    padding: 10,
  },
  recalled: {
    borderColor: 'green',
    borderWidth: 3,
  },
  notRecalled: {
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
  card: Card,
  updateCards: (cardUpdates: Array<CardUpdate>) => Promise<void>,
|}

export type State = {|
  newMnemonic: string | null,
  recalled: boolean,
  recalledAtMillis: number | null,
|}

export default class SlowSpeakGameScreen
  extends React.PureComponent<Props, State> {
  timerStartedAtMillis: number

  constructor(props: Props) {
    super(props)
    this.timerStartedAtMillis = new Date().getTime()
    this.state = {
      newMnemonic: null,
      recalled: false,
      recalledAtMillis: null,
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.card.leafIdsCsv !== prevProps.card.leafIdsCsv) {
      this.timerStartedAtMillis = new Date().getTime()
      this.setState({
        newMnemonic: null,
        recalled: false,
        recalledAtMillis: null,
      })
    }
  }

  onMnemonicSubmitEditing = (mnemonic: string) =>
    this.props.updateCards([{
      leafIdsCsv: this.props.card.leafIdsCsv,
      mnemonic,
    }])

  speakMnemonicAndSpanish() {
    const es = this.props.card.glossRows[0].es
    const mnemonic = this.props.card.mnemonic

    if (mnemonic !== '') {
      Speech.speak(mnemonic, { language: 'en', onDone: () =>
        Speech.speak(es, { language: 'es', rate: 0.5 })
      })
    } else {
      Speech.speak(es, { language: 'es', rate: 0.5 })
    }
  }

  toggleRecalled = () => {
    this.speakMnemonicAndSpanish()
    this.setState(prevState => {
      if (prevState.recalledAtMillis === null) {
        return {
          recalled: true,
          recalledAtMillis: new Date().getTime(),
        }
      } else {
        return { recalled: !prevState.recalled }
      }
    })
  }

  pressNext = () => {
    Speech.stop()

    const { timerStartedAtMillis } = this
    const { recalled, recalledAtMillis } = this.state
    const { card } = this.props

    this.props.updateCards([{
      leafIdsCsv: card.leafIdsCsv,
      lastSeenAt: Math.floor(timerStartedAtMillis / 1000),
      stage: recalled ? STAGE3_PASSED : STAGE2_WRONG,
    }])
  }

  renderAnswer() {
    return <View style={[
      styles.answer,
      this.state.recalled ? styles.recalled : styles.notRecalled,
    ]}>
      <TextInput
        style={styles.mnemonic}
        multiline={true}
        returnKeyType="done"
        blurOnSubmit={true} // makes Return submit instead of insert LF
        onChangeText={(newMnemonic: string) =>
          this.setState({ newMnemonic })}
        onSubmitEditing={this.onMnemonicSubmitEditing}
        autoCapitalize="none"
        value={this.state.newMnemonic !== null ?
          this.state.newMnemonic : this.props.card.mnemonic} />
      <Text style={styles.es}>{this.props.card.glossRows[0].es}</Text>
    </View>
  }

  render() {
    return <View style={styles.container}>
      <Text style={styles.en}>
        {this.props.card.prompt}
      </Text>

      {this.state.recalledAtMillis === null
        ? <Button onPress={this.toggleRecalled} title='I remember' />
        : <TouchableOpacity onPress={this.toggleRecalled}>
          {this.renderAnswer()}
        </TouchableOpacity>}

      <Button
        onPress={this.pressNext}
        title={this.state.recalledAtMillis === null ? 'I forget' : 'Next card'}
      />
    </View>
  }
}
