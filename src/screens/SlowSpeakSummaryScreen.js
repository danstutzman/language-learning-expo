import React from 'react'
import { Button, ScrollView, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
})

export type Props = {|
  startSlowSpeakGame: () => void,
|}

export default class SlowSpeakSummaryScreen extends React.PureComponent<Props> {
  render() {
    return <ScrollView style={styles.container}>
      <Button
        onPress={this.props.startSlowSpeakGame}
        title='Start Slow Speak Game' />
    </ScrollView>
  }
}