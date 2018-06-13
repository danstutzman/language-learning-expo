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
|}

type State = {|
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
  state = {
    showMnemonic: false,
  }

  onRemembered = () =>
    this.props.exposeCard(true)

  onForgot = () =>
    this.setState({ showMnemonic: true })

  onAdvance = () => {
    this.setState({ showMnemonic: false })
    this.props.exposeCard(false)
  }

  _renderForgotOrMnemonic() {
    if (this.state.showMnemonic) {
      return <View>
        <Text>{this.props.card.mnemonic}</Text>
        <Text>{this.props.card.es}</Text>
        <Button onPress={this.onAdvance} title='Advance' />
      </View>
    } else {
      return <Button onPress={this.onForgot} title='Forgot' />
    }
  }

  render() {
    return <View style={styles.container}>
      <Text>Speak the Spanish for:</Text>
      <Text>{this.props.card.en}</Text>

      <Button onPress={this.onRemembered} title='Remembered' />
      {this._renderForgotOrMnemonic()}
    </View>
  }
}
