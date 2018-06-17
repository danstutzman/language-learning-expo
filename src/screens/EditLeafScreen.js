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

import { assertInfCategory } from '../model/InfCategory'
import { assertLeafType } from '../model/LeafType'
import { assertNumber } from '../model/Number'
import { assertPerson } from '../model/Person'
import { assertTense } from '../model/Tense'
import { BLANK_LEAF } from '../model/Leaf'
import { INF_CATEGORY_TO_DESCRIPTION } from '../model/InfCategory'
import type { Leaf } from '../model/Leaf'
import type { LeafType } from '../model/LeafType'
import { LEAF_TYPE_TO_FIELDS } from '../model/LeafType'
import { LEAF_TYPE_TO_DESCRIPTION } from '../model/LeafType'
import { NUMBER_TO_DESCRIPTION } from '../model/Number'
import { PERSON_TO_DESCRIPTION } from '../model/Person'
import { TENSE_TO_DESCRIPTION } from '../model/Tense'

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
  pickerField: {
    borderWidth: 1,
  },
  pickerFieldItem: {
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
          style={styles.pickerField}
          itemStyle={styles.pickerFieldItem}
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

      {show.infCategory && <View>
        <Text>Infinitive Category</Text>
        <Picker
          style={styles.pickerField}
          itemStyle={styles.pickerFieldItem}
          selectedValue={leaf.infCategory}
          onValueChange={item => this.setState(
            { leaf: { ...leaf, infCategory: assertInfCategory(item) } })}>
          {Object.keys(INF_CATEGORY_TO_DESCRIPTION).map(infCategory =>
            <Picker.Item
              key={infCategory}
              label={INF_CATEGORY_TO_DESCRIPTION[infCategory]}
              value={infCategory} />
          )}
        </Picker>
      </View>}

      {show.number && <View>
        <Text>Number</Text>
        <Picker
          style={styles.pickerField}
          itemStyle={styles.pickerFieldItem}
          selectedValue={leaf.number}
          onValueChange={item => this.setState(
            { leaf: { ...leaf, number: assertNumber(item) } })}>
          {Object.keys(NUMBER_TO_DESCRIPTION).map(number =>
            <Picker.Item
              key={number}
              label={NUMBER_TO_DESCRIPTION[number]}
              value={parseInt(number, 10)} />
          )}
        </Picker>
      </View>}

      {show.person && <View>
        <Text>Person</Text>
        <Picker
          style={styles.pickerField}
          itemStyle={styles.pickerFieldItem}
          selectedValue={leaf.person}
          onValueChange={item => this.setState(
            { leaf: { ...leaf, person: assertPerson(item) } })}>
          {Object.keys(PERSON_TO_DESCRIPTION).map(person =>
            <Picker.Item
              key={person}
              label={PERSON_TO_DESCRIPTION[person]}
              value={parseInt(person, 10)} />
          )}
        </Picker>
      </View>}

      {show.tense && <View>
        <Text>Tense</Text>
        <Picker
          style={styles.pickerField}
          itemStyle={styles.pickerFieldItem}
          selectedValue={leaf.tense}
          onValueChange={item => this.setState(
            { leaf: { ...leaf, tense: assertTense(item) } })}>
          {Object.keys(TENSE_TO_DESCRIPTION).map(tense =>
            <Picker.Item
              key={tense}
              label={TENSE_TO_DESCRIPTION[tense]}
              value={tense} />
          )}
        </Picker>
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