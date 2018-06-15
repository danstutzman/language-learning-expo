import React from 'react'
import {
  Button,
  Switch,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'

import type { Leaf } from '../model/Leaf'
import { BLANK_LEAF } from '../model/Leaf'

type Props = {|
  addLeaf: (leaf: Leaf) => void,
  deleteLeaf: (leaf: Leaf) => void,
  editLeaf: (leaf: Leaf) => void,
  initialLeaf: Leaf,
|}

type State = {|
  leaf: Leaf,
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

export default class EditLeafScreen extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { leaf: this.props.initialLeaf }
  }

  componentWillUnmount() {
    if (this.state.leaf.leafId !== 0) {
      this.props.editLeaf(this.state.leaf)
    }
  }

  onPressAdd = () => {
    this.props.addLeaf(this.state.leaf)
    this.setState({ leaf: BLANK_LEAF })
  }

  onPressDelete = () => {
    this.props.deleteLeaf(this.state.leaf)
    this.setState({ leaf: BLANK_LEAF })
  }

  render() {
    return <View style={styles.container}>

      <Text>Type</Text>
      <TextInput
        style={styles.textInput}
        onChangeText={(type: string) =>
          this.setState({ leaf: { ...this.state.leaf, type } })}
        value={this.state.leaf.type} />

      <Text>Spanish</Text>
      <TextInput
        style={styles.textInput}
        onChangeText={(es: string) =>
          this.setState({ leaf: { ...this.state.leaf, es } })}
        value={this.state.leaf.es} />

      <Text>English</Text>
      <TextInput
        style={styles.textInput}
        onChangeText={(en: string) =>
          this.setState({ leaf: { ...this.state.leaf, en } })}
        value={this.state.leaf.en} />

      <Text>Gender</Text>
      <TextInput
        style={styles.textInput}
        onChangeText={(gender: string) =>
          this.setState({ leaf: { ...this.state.leaf, gender } })}
        value={this.state.leaf.gender} />

      <Text>Mnemonic</Text>
      <TextInput
        style={styles.textInput}
        onChangeText={(mnemonic: string) =>
          this.setState({ leaf: { ...this.state.leaf, mnemonic } })}
        value={this.state.leaf.mnemonic} />

      <Text>Suspended</Text>
      <Switch
        title='Suspended'
        onValueChange={(suspended: boolean) =>
          this.setState({ leaf: { ...this.state.leaf, suspended } })}
        value={this.state.leaf.suspended} />

      {this.state.leaf.leafId === 0 ?
        <Button onPress={this.onPressAdd} title='Add' /> :
        <Button onPress={this.onPressDelete} title='Delete' />}
    </View>
  }
}
