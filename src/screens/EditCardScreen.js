import React from 'react'
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'

import type { Card } from '../model/Card'
import { BLANK_CARD } from '../model/Card'

type Props = {|
  addCard: (card: Card) => void,
  deleteCard: (card: Card) => void,
  editCard: (card: Card) => void,
  initialCard: Card,
|}

type State = {|
  card: Card,
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

export default class EditCardScreen extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      card: props.initialCard,
    }
  }

  onPressAdd = () => {
    this.props.addCard(this.state.card)
    this.setState({ card: BLANK_CARD })
  }

  onPressDelete = () => {
    this.props.deleteCard(this.state.card)
    this.setState({ card: BLANK_CARD })
  }

  onPressEdit = () => {
    this.props.editCard(this.state.card)
    this.setState({ card: BLANK_CARD })
  }

  render() {
    return <View style={styles.container}>

      <Text>Type</Text>
      <TextInput
        style={styles.textInput}
        onChangeText={(type: string) => this.setState({
          card: { ...this.state.card, type },
        })}
        value={this.state.card.type} />

      <Text>English</Text>
      <TextInput
        style={styles.textInput}
        onChangeText={(en: string) => this.setState({
          card: { ...this.state.card, en },
        })}
        value={this.state.card.en} />

      <Text>Spanish</Text>
      <TextInput
        style={styles.textInput}
        onChangeText={(es: string) => this.setState({
          card: { ...this.state.card, es },
        })}
        value={this.state.card.es} />

      <Text>Gender</Text>
      <TextInput
        style={styles.textInput}
        onChangeText={(gender: string) => this.setState({
          card: { ...this.state.card, gender },
        })}
        value={this.state.card.gender} />

      <Text>Mnemonic</Text>
      <TextInput
        style={styles.textInput}
        onChangeText={(mnemonic: string) => this.setState({
          card: { ...this.state.card, mnemonic },
        })}
        value={this.state.card.mnemonic} />

      {this.state.card.cardId === 0 ?
        <Button onPress={this.onPressAdd} title='Add' /> :
        <View>
          <Button onPress={this.onPressEdit} title='Edit' />
          <Button onPress={this.onPressDelete} title='Delete' />
        </View>}
    </View>
  }
}