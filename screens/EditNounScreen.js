import React from 'react'
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'

import type { Noun } from '../model/Noun'

type Props = {|
  addNoun: (noun: Noun) => void,
  editNoun: (noun: Noun) => void,
  initialNoun: Noun,
|}

type State = {|
  noun: Noun,
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

export default class EditNounScreen extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      noun: props.initialNoun,
    }
  }

  onPressAdd = () => {
    this.props.addNoun(this.state.noun)
    this.setState({
      noun: {
        id: -1,
        en: '',
        es: '',
      }
    })
  }

  onPressEdit = () => {
    this.props.editNoun(this.state.noun)
    this.setState({
      noun: {
        id: -1,
        en: '',
        es: '',
      }
    })
  }

  render() {
    return <View style={styles.container}>

      <Text>English</Text>
      <TextInput
        style={styles.textInput}
        onChangeText={(en: string) => this.setState({ noun: { ...this.state.noun, en } })}
        value={this.state.noun.en} />

      <Text>Spanish</Text>
      <TextInput
        style={styles.textInput}
        onChangeText={(es: string) => this.setState({ noun: { ...this.state.noun, es } })}
        value={this.state.noun.es} />

      {this.state.noun.id === -1 ?
        <Button onPress={this.onPressAdd} title='Add' /> :
        <Button onPress={this.onPressEdit} title='Edit' />}
    </View>
  }
}