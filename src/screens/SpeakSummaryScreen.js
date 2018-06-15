import React from 'react'
import {
  Button,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import type { Model } from '../model/Model'

type Props = {|
  model: Model,
  startSpeakQuiz: () => void,
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

export default class SpeakSummaryScreen extends React.PureComponent<Props> {
  render() {
    return <View style={styles.container}>
      <Text>numCards: {this.props.model.speakCards.length}</Text>
      <Button onPress={this.props.startSpeakQuiz} title='Start quiz' />
    </View>
  }
}
