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

import { DELAY_THRESHOLD } from '../cards/Skill'
import type { LeafCard } from '../cards/LeafCard'
import { PERSON_TO_DESCRIPTION } from '../cards/enums/Person'
import RegVPattern from '../cards/verbs/RegVPattern'
import type { Skill } from '../cards/Skill'
import type { SkillUpdate } from '../db/SkillUpdate'
import { TENSE_TO_DESCRIPTION } from '../cards/enums/Tense'

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
    if (this.props.leafCard.cardId !== prevProps.leafCard.cardId) {
      this.timerStartedAtMillis = new Date().getTime()
      this.setState({
        newMnemonic: null,
        recalled: false,
        recalledAtMillis: null,
      })
    }
  }

  onMnemonicSubmitEditing = (mnemonic: string) =>
    this.props.updateSkills([{ cardId: this.props.leafCard.cardId, mnemonic }])

  speakMnemonicAndSpanish() {
    const es = this.props.leafCard.getGlossRow().es
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
    const { leafCard, skill } = this.props

    let enduranceUpdate = {}
    if (recalled) {
      if (skill.lastCorrectAt !== 0) {
        const newEndurance =
          Math.floor(timerStartedAtMillis / 1000 - skill.lastCorrectAt)
        if (newEndurance > skill.endurance) {
          enduranceUpdate = { endurance: newEndurance }
        }
      }
    } else {
      enduranceUpdate = { endurance: 0 }
    }

    this.props.updateSkills([{
      cardId: leafCard.cardId,
      delay: (recalled && recalledAtMillis !== null)
        ? recalledAtMillis - timerStartedAtMillis : DELAY_THRESHOLD,
      lastCorrectAt: recalled ? (timerStartedAtMillis / 1000) : 0,
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
        value={this.state.newMnemonic !== null ?
          this.state.newMnemonic : this.props.skill.mnemonic} />
      <Text style={styles.es}>{this.props.leafCard.getGlossRow().es}</Text>
    </View>
  }

  renderQuestionForRegVPattern() {
    const pattern: RegVPattern = (this.props.leafCard: any)
    return <View>
      <Text>Say the ending for:</Text>
      <Text>* {pattern.infCategory} verb</Text>
      <Text>* {PERSON_TO_DESCRIPTION[pattern.person.toString()]} person</Text>
      <Text>* {TENSE_TO_DESCRIPTION[pattern.tense]}</Text>
    </View>
  }

  render() {
    return <View style={styles.container}>
      {this.props.leafCard instanceof RegVPattern
        ? this.renderQuestionForRegVPattern()
        : <Text style={styles.en}>
          {this.props.leafCard.getQuizQuestion()}
        </Text>}

      {this.state.recalledAtMillis === null
        ? <Button onPress={this.toggleRecalled} title='Tap when you remember' />
        : <TouchableOpacity onPress={this.toggleRecalled}>
          {this.renderAnswer()}
        </TouchableOpacity>}

      <Button onPress={this.pressNext} title="Next" />
    </View>
  }
}
