import React from 'react'
import { Speech } from 'expo'
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { FontAwesome } from '@expo/vector-icons'

import Colors from '../constants/Colors'
import type { Card } from '../model/Card'

type Props = {|
  card: Card,
  exposeCard: (remembered: boolean) => void,
  suspendCard: () => void,
|}

type State = {|
  remembered: boolean,
  secondsLeft: number,
  showMnemonic: boolean,
|}

const SECONDS_LEFT_TO_ICON = {
  '3': 'hourglass-start',
  '2': 'hourglass-half',
  '1': 'hourglass-end',
}

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
    textAlign: 'right',
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
    justifyContent: 'space-between',
  },
  gloss_table_english: {
    fontVariant: ['small-caps'],
    fontSize: 40,
    marginLeft: 10,
    flex: 1,
  },
  gloss_table_spanish: {
    flex: 1,
    fontSize: 40,
    fontStyle: 'italic',
    textAlign: 'right',
    marginRight: 10,
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

  constructor(props: Props) {
    super(props)
    this.state = {
      remembered: false,
      secondsLeft: 3,
      showMnemonic: false,
    }
    this.setInterval()
  }

  componentWillUnmount() {
    clearInterval(this.countdown)
  }

  componentWillReceiveProps() {
    this.setState({
      remembered: false,
      secondsLeft: 3,
      showMnemonic: false,
    }, this.setInterval)
  }

  setInterval() {
    if (this.countdown !== null) {
      this.countdown = setInterval(() =>
        this.setState(prevState => {
          if (prevState.secondsLeft === 1) {
            clearInterval(this.countdown)
            this.speakSpanish()
            return { secondsLeft: 0 }
          } else {
            return { secondsLeft: prevState.secondsLeft - 1 }
          }
        }),
        1000
      )
    }
  }

  pressGlossTableRow = () => {
    clearInterval(this.countdown)
    this.speakSpanish()
    this.setState(prevState => ({
      remembered: !prevState.remembered,
      secondsLeft: 0,
    }))
  }

  onNext = () =>
    this.props.exposeCard(this.state.remembered)

  onSuspend = () =>
    this.props.suspendCard()

  speakSpanish = () =>
    Speech.speak(this.props.card.es, { language: 'es', rate: 0.5 })

  render() {
    return <View style={styles.container}>
      <Text style={styles.instructions}>Tap word when you remember</Text>
      <View style={styles.gloss_table}>
        <TouchableOpacity onPress={this.pressGlossTableRow}>
          <View style={styles.gloss_table_row}>
            <Text style={styles.gloss_table_english}>{this.props.card.en}</Text>
            {this.state.secondsLeft > 0 ?
              <FontAwesome
                style={styles.hourglass}
                name={SECONDS_LEFT_TO_ICON[this.state.secondsLeft]}
                size={26}
                color="#ddd" /> :
              <Text style={[
                styles.gloss_table_spanish,
                this.state.remembered ? styles.remembered : styles.forgotten,
              ]}>
                {this.props.card.es}
              </Text>}
          </View>
        </TouchableOpacity>
      </View>

      <Button onPress={this.onNext} title='Next' />
      <Button onPress={this.onSuspend} title='Suspend' />
    </View>
  }
}
