import React from 'react'
import { Button, View } from 'react-native'
import { ExpoConfigView } from '@expo/samples'

type Props = {|
  exportDatabase: () => void,
  reseedDatabase: () => Promise<void>,
|}

export default class SettingsScreen extends React.PureComponent<Props> {
  render() {
    // Go ahead and delete ExpoConfigView and replace it with your
    // content, we just wanted to give you a quick view of your config
    return <View>
      <Button onPress={this.props.exportDatabase} title='Export database' />
      <Button onPress={this.props.reseedDatabase} title='Reseed database' />
      <ExpoConfigView />
    </View>
  }
}