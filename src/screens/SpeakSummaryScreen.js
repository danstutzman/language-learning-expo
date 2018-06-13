import React from 'react'
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import type { Card } from '../model/Card'

type Props = {|
  cards: Array<Card>,
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
      <Button onPress={this.props.startSpeakQuiz} title='Start' />
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Text>props: {JSON.stringify(this.props)}</Text>
      </ScrollView>
    </View>
  }
}
