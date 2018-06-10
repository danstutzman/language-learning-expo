import React from 'react'
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'

import type { Noun } from '../types/Noun'

type Props = {|
  addNoun: (noun: Noun) => void,
|}

type State = {|
  en: string,
  es: string,
|}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  textInput: {
    borderWidth: 1,
  },
})

export default class AddNounScreen extends React.PureComponent<Props, State> {
  state = {
    en: '',
    es: '',
  }

  onPressAdd = () => {
    this.props.addNoun({
      en: this.state.en,
      es: this.state.es,
    })
    this.setState({
      en: '',
      es: '',
    })
  }

  render() {
    return <View style={styles.container}>

      <Text>English</Text>
      <TextInput
        style={styles.textInput}
        onChangeText={(en: string) => this.setState({ en })}
        value={this.state.en} />

      <Text>Spanish</Text>
      <TextInput
        style={styles.textInput}
        onChangeText={(es: string) => this.setState({ es })}
        value={this.state.es} />

      <Button onPress={this.onPressAdd} title='Add' />
    </View>
  }
}