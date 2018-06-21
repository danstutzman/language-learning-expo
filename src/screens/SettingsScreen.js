import React from 'react'
import { Alert, Button, View } from 'react-native'
import { ExpoConfigView } from '@expo/samples'

type Props = {|
  deleteDatabase: () => Promise<void>,
  downloadDatabase: () => Promise<void>,
  uploadDatabase: () => Promise<void>,
|}

export default class SettingsScreen extends React.PureComponent<Props> {
  onPressDeleteDatabase = () =>
    this.props.deleteDatabase()
      .then(() => Alert.alert(
        'Delete database',
        'Delete was successful',
        [{ text: 'OK' }],
        { cancelable: false }
      ))
      .catch((e: Error) => Alert.alert(
        'Delete database',
        e.message,
        [{ text: 'OK' }],
        { cancelable: false }
      ))

  onPressDownloadDatabase = () =>
    this.props.downloadDatabase()
      .then(() => Alert.alert(
        'Download database',
        'Download was successful',
        [{ text: 'OK' }],
        { cancelable: false }
      ))
      .catch((e: Error) => Alert.alert(
        'Download database',
        e.message,
        [{ text: 'OK' }],
        { cancelable: false }
      ))

  onPressUploadDatabase = () =>
    this.props.uploadDatabase()
      .then(() => Alert.alert(
        'Upload database',
        'Upload was successful',
        [{ text: 'OK' }],
        { cancelable: false }
      ))
      .catch((e: Error) => Alert.alert(
        'Upload database',
        e.message,
        [{ text: 'OK' }],
        { cancelable: false }
      ))

  render() {
    // Go ahead and delete ExpoConfigView and replace it with your
    // content, we just wanted to give you a quick view of your config
    return <View>
      <Button onPress={this.onPressDeleteDatabase} title='Delete database' />
      <Button onPress={this.onPressDownloadDatabase} title='Download database' />
      <Button onPress={this.onPressUploadDatabase} title='Upload database' />
      <ExpoConfigView />
    </View>
  }
}