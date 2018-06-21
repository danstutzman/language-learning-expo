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
import { DELAY_THRESHOLD } from '../cards/Skill'
import type { Skill } from '../cards/Skill'
import type { SkillUpdate } from '../db/SkillUpdate'

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
  skill: Skill,
  updateSkills: (Array<SkillUpdate>) => Promise<void>,
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
    if (this.props.card.cardId !== prevProps.card.cardId) {
      this.timerStartedAtMillis = new Date().getTime()
      this.setState({
        newMnemonic: null,
        recalled: false,
        recalledAtMillis: null,
      })
    }
  }

  onMnemonicSubmitEditing = (mnemonic: string) =>
    this.props.updateSkills([{ cardId: this.props.card.cardId, mnemonic }])

  speakMnemonicAndSpanish() {
    const es = this.props.card.glossRows[0].es
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

    const { timerStartedAtMillis } = this
    const { recalled, recalledAtMillis } = this.state
    const { card, skill } = this.props

    let enduranceUpdate = {}
    if (recalled) {
      if (skill.lastSeenAt !== 0 && skill.delay < DELAY_THRESHOLD) {
        const newEndurance =
          Math.floor(timerStartedAtMillis / 1000 - skill.lastSeenAt)
        if (newEndurance > skill.endurance) {
          enduranceUpdate = { endurance: newEndurance }
        }
      }
    } else {
      enduranceUpdate = { endurance: 0 }
    }

    this.props.updateSkills([{
      cardId: card.cardId,
      delay: (recalled && recalledAtMillis !== null)
        ? recalledAtMillis - timerStartedAtMillis : DELAY_THRESHOLD,
      lastSeenAt: Math.floor(timerStartedAtMillis / 1000),
      ...enduranceUpdate,
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
          this.state.newMnemonic : this.props.skill.mnemonic} />
      <Text style={styles.es}>{this.props.card.glossRows[0].es}</Text>
    </View>
  }

  render() {
    return <View style={styles.container}>
      <Text style={styles.en}>
        {this.props.card.quizQuestion}
      </Text>

      {this.state.recalledAtMillis === null
        ? <Button onPress={this.toggleRecalled} title='Tap when you remember' />
        : <TouchableOpacity onPress={this.toggleRecalled}>
          {this.renderAnswer()}
        </TouchableOpacity>}

      <Button onPress={this.pressNext} title="Next" />
    </View>
  }
}
