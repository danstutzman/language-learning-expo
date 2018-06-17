import ActionButton from 'react-native-action-button'
import React from 'react'
import {
  Button,
  ScrollView,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SearchBar } from 'react-native-elements'

import type { Leaf } from '../model/Leaf'
import { LEAF_TYPE_TO_DESCRIPTION } from '../model/LeafType'
import Colors from '../constants/Colors'

type Props = {|
  allLeafs: Array<Leaf>,
  exportDatabase: () => void,
  reseedDatabase: () => Promise<void>,
  showAddLeafScreen: () => void,
  showEditLeafScreen: (leafId: number) => void,
|}

type State = {|
  searchText: string,
|}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
  },
  searchBarContainer: {
    backgroundColor: 'white',
    borderBottomWidth: 0,
  },
  sectionHeader: {
    backgroundColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 10,
    paddingRight: 10,
  },
  sectionHeaderEnglish: {
    color: 'gray',
  },
  sectionHeaderTitle: {
  },
  sectionHeaderSpanish: {
    color: 'gray',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listItemEs: {
    fontSize: 24,
    fontStyle: 'italic',
    paddingLeft: 10,
  },
  listItemEn: {
    fontSize: 24,
    fontVariant: ['small-caps'],
    paddingRight: 10,
  },
})

export default class EditLeafsScreen extends React.PureComponent<Props, State> {
  searchBar: number

  state = {
    searchText: '',
  }

  filterLeafBySearch = (leaf: Leaf): boolean => {
    const needle = this.state.searchText.toLowerCase()
    return needle === '' ||
      leaf.en.toLowerCase().indexOf(needle) !== -1 ||
      leaf.es.toLowerCase().indexOf(needle) !== -1
  }

  groupLeafsIntoSections = () => {
    const leafsByType: {[string]: Array<Leaf>} = {}
    for (const leaf of this.props.allLeafs.filter(this.filterLeafBySearch)) {
      if (leafsByType[leaf.type] === undefined) {
        leafsByType[leaf.type] = []
      }
      leafsByType[leaf.type].push(leaf)
    }

    const sections = []
    for (const type of Object.keys(LEAF_TYPE_TO_DESCRIPTION)) {
      const leafs = leafsByType[type]
      if (leafs !== undefined) {
        const sectionTitle = LEAF_TYPE_TO_DESCRIPTION[type] + 's'
        leafs.sort((leaf1: Leaf, leaf2: Leaf) =>
          leaf1.es.localeCompare(leaf2.es))
        sections.push({ title: sectionTitle, data: leafs })
      }
    }

    return sections
  }

  onChangeSearchText = (searchText: string) =>
    this.setState({ searchText })

  onPressListItem = (leaf: Leaf) =>
    this.props.showEditLeafScreen(leaf.leafId)

  renderSectionHeader= (section: { section: any }) =>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderSpanish}>Spanish</Text>
      <Text style={styles.sectionHeaderTitle}>{section.section.title}</Text>
      <Text style={styles.sectionHeaderEnglish}>English</Text>
    </View>

  renderListItem = (item: { item: Leaf }) =>
    <TouchableOpacity onPress={() => this.onPressListItem(item.item)}>
      <View style={styles.listItem}>
        <Text style={styles.listItemEs}>{item.item.es}</Text>
        <Text style={styles.listItemEn}>{item.item.en}</Text>
      </View>
    </TouchableOpacity>

  render() {
    return <View style={styles.container}>
      <SearchBar
        lightTheme
        containerStyle={styles.searchBarContainer}
        onChangeText={this.onChangeSearchText}
        clearButtonMode={this.state.searchText === '' ? 'never' : 'always'}
        autoCapitalize="none"
        autoCorrect={false} />

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <SectionList
          sections={this.groupLeafsIntoSections()}
          renderItem={this.renderListItem}
          renderSectionHeader={this.renderSectionHeader}
          keyExtractor={item => item.leafId} />
        <Button title='Export database' onPress={this.props.exportDatabase} />
        <Button title='Reseed database' onPress={this.props.reseedDatabase} />
      </ScrollView>

      <ActionButton
        buttonColor={Colors.tintColor}
        onPress={this.props.showAddLeafScreen} />
    </View>
  }
}
