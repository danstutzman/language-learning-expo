import React from 'react'
import {
  Button,
  Picker,
  Switch,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'

import { assertLeafType } from '../model/LeafType'
import { BLANK_LEAF } from '../model/Leaf'
import type { Leaf } from '../model/Leaf'
import type { LeafType } from '../model/LeafType'
import { LEAF_TYPE_TO_FIELDS } from '../model/LeafType'
import { LEAF_TYPE_TO_DESCRIPTION } from '../model/LeafType'

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
  typeField: {
    borderWidth: 1,
  },
  typeFieldItem: {
    height: 35,
    fontSize: 16,
  },
})

function setFieldsBasedOnType(leaf: Leaf, type: LeafType) {
  const hasField = LEAF_TYPE_TO_FIELDS[type]
  if (hasField === undefined) {
    throw new Error(`Unknown type ${type}`)
  }
  return {
    ...leaf,
    type,
    gender: hasField.gender ? leaf.gender || '' : undefined,
  }
}

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
    const { leaf } = this.state
    const show = LEAF_TYPE_TO_FIELDS[leaf.type]

    return <View style={styles.container}>

      <View>
        <Text>Type</Text>
        <Picker
          style={styles.typeField}
          itemStyle={styles.typeFieldItem}
          selectedValue={leaf.type}
          onValueChange={item => this.setState(
            { leaf: setFieldsBasedOnType(leaf, assertLeafType(item)) })}>
          {Object.keys(LEAF_TYPE_TO_DESCRIPTION).map(type =>
            <Picker.Item
              key={type}
              label={LEAF_TYPE_TO_DESCRIPTION[type]}
              value={type} />
          )}
        </Picker>
      </View>

      <View>
        <Text>Spanish</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={(es: string) =>
            this.setState({ leaf: { ...leaf, es } })}
          value={leaf.es} />
      </View>

      <View>
        <Text>English</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={(en: string) =>
            this.setState({ leaf: { ...leaf, en } })}
          value={leaf.en} />
      </View>

      {show.gender && <View>
        <Text>Gender</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={(gender: string) =>
            this.setState({ leaf: { ...leaf, gender } })}
          value={leaf.gender} />
      </View>}

      <View>
        <Text>Mnemonic</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={(mnemonic: string) =>
            this.setState({ leaf: { ...leaf, mnemonic } })}
          value={leaf.mnemonic} />
      </View>

      <View>
        <Text>Suspended</Text>
        <Switch
          title='Suspended'
          onValueChange={(suspended: boolean) =>
            this.setState({ leaf: { ...leaf, suspended } })}
          value={leaf.suspended} />
      </View>

      {leaf.leafId === 0 ?
        <Button onPress={this.onPressAdd} title='Add' /> :
        <Button onPress={this.onPressDelete} title='Delete' />}
    </View>
  }
}