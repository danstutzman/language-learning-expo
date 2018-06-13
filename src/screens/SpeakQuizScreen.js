import React from 'react'
import {
  StyleSheet,
  Text,
  View,
} from 'react-native'

import type { Card } from '../model/Card'

type Props = {|
  topCard: Card,
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

export default class SpeakQuizScreen extends React.PureComponent<Props> {
  render() {
    return <View style={styles.container}>
      <Text>{JSON.stringify(this.props)}</Text>
    </View>
  }
}
