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

import type { LeafCard } from '../cards/LeafCard'
import type { Skill } from '../cards/Skill'

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
  leafCard: LeafCard,
  skill: Skill,
  editMnemonic: (mnemonic: string) => void,
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
    if (this.props.leafCard.cardId !== prevProps.leafCard.cardId) {
      this.timerStartedAtMillis = new Date().getTime()
      this.setState({
        newMnemonic: null,
        recalled: false,
        recalledAtMillis: null,
      })
    }
  }

  speakMnemonicAndSpanish() {
    const es = this.props.leafCard.es
    const mnemonic = this.props.skill.mnemonic
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

    // const { recalled, recalledAtMillis } = this.state
    // this.props.addExposures([{
    //   exposureId: 0,
    //   type: this.state.recalled ? 'RECALLED_ES' : 'DIDNT_RECALL_ES',
    //   createdAt: this.timerStartedAtMillis / 1000,
    //   leafIds: [this.props.leaf.leafId],
    //   delay: recalled && recalledAtMillis !== null
    //     ? recalledAtMillis - this.timerStartedAtMillis : null,
    // }])
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
        onSubmitEditing={() =>
          this.props.editMnemonic(this.state.newMnemonic || '')}
        value={this.state.newMnemonic !== null ?
          this.state.newMnemonic : this.props.skill.mnemonic} />
      <Text style={styles.es}>{this.props.leafCard.es}</Text>
    </View>
  }

  render() {
    return <View style={styles.container}>
      <Text style={styles.en}>{this.props.leafCard.getGloss()}</Text>

      {this.state.recalledAtMillis === null
        ? <Button onPress={this.toggleRecalled} title='Tap when you remember' />
        : <TouchableOpacity onPress={this.toggleRecalled}>
          {this.renderAnswer()}
        </TouchableOpacity>}

      <Button onPress={this.pressNext} title="Next" />
    </View>
  }
}
