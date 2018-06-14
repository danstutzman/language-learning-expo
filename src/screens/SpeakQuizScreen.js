import React from 'react'
import {
  Button,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import type { Card } from '../model/Card'

type Props = {|
  card: Card,
  exposeCard: (remembered: boolean) => void,
  suspendCard: () => void,
|}

type State = {|
  secondsLeft: number,
  showMnemonic: boolean,
|}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: 30,
  },
})

export default class SpeakQuizScreen extends React.PureComponent<Props, State> {
  countdown: IntervalID

  constructor(props: Props) {
    super(props)
    this.state = {
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
      secondsLeft: 3,
      showMnemonic: false,
    }, this.setInterval)
  }

  setInterval() {
    if (this.countdown !== null) {
      this.countdown = setInterval(() =>
        this.setState(prevState => {
          if (prevState.secondsLeft === 0) {
            clearInterval(this.countdown)
          } else {
            return {
              secondsLeft: prevState.secondsLeft - 1,
            }
          }
        }),
        1000
      )
    }
  }

  onRemembered = () =>
    this.props.exposeCard(true)

  onForgot = () =>
    this.props.exposeCard(false)

  onSuspend = () =>
    this.props.suspendCard()

  render() {
    return <View style={styles.container}>
      <Text>Speak the Spanish for:</Text>
      <Text>{this.props.card.en}</Text>
      <Text>secondsLeft: {this.state.secondsLeft}</Text>

      {this.state.secondsLeft === 0 && <View>
        <Text>{this.props.card.mnemonic}</Text>
        <Text>{this.props.card.es}</Text>
      </View>}

      <Button onPress={this.onRemembered} title='Remembered' />
      <Button onPress={this.onForgot} title='Forgot' />
      <Button onPress={this.onSuspend} title='Suspend' />
    </View>
  }
}
