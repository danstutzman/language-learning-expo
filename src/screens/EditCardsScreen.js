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

import type { Card } from '../model/Card'
import Colors from '../constants/Colors'

type Props = {|
  allCards: Array<Card>,
  showAddCardScreen: () => void,
  showEditCardScreen: (cardId: number) => void,
|}

type State = {|
  searchText: string,
|}

const CARD_TYPE_TO_SECTION_TITLE = {
  EsN: 'Nouns',
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: 30,
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
  listItemEn: {
    fontSize: 24,
    fontVariant: ['small-caps'],
    paddingLeft: 10,
  },
  listItemEs: {
    fontSize: 24,
    fontStyle: 'italic',
    paddingRight: 10,
  },
})

export default class EditCardsScreen extends React.PureComponent<Props, State> {
  searchBar: number

  state = {
    searchText: '',
  }

  filterCardBySearch = (card: Card): boolean => {
    const needle = this.state.searchText.toLowerCase()
    return needle === '' ||
      card.en.toLowerCase().indexOf(needle) !== -1 ||
      card.es.toLowerCase().indexOf(needle) !== -1
  }

  groupCardsIntoSections = () => {
    const cardsByType: {[string]: Array<Card>} = {}
    for (const card of this.props.allCards.filter(this.filterCardBySearch)) {
      if (cardsByType[card.type] === undefined) {
        cardsByType[card.type] = []
      }
      cardsByType[card.type].push(card)
    }

    const sections = []
    for (const type of Object.keys(CARD_TYPE_TO_SECTION_TITLE)) {
      const cards = cardsByType[type]
      if (cards !== undefined) {
        const sectionTitle = CARD_TYPE_TO_SECTION_TITLE[type]
        sections.push({ title: sectionTitle, data: cards })
      }
    }

    return sections
  }

  onChangeSearchText = (searchText: string) =>
    this.setState({ searchText })

  onPressListItem = (card: Card) =>
    this.props.showEditCardScreen(card.cardId)

  renderSectionHeader= (section: { section: any }) =>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderEnglish}>English</Text>
      <Text style={styles.sectionHeaderTitle}>{section.section.title}</Text>
      <Text style={styles.sectionHeaderSpanish}>Spanish</Text>
    </View>

  renderListItem = (item: { item: Card }) =>
    <TouchableOpacity onPress={() => this.onPressListItem(item.item)}>
      <View style={styles.listItem}>
        <Text style={styles.listItemEn}>{item.item.en}</Text>
        <Text style={styles.listItemEs}>{item.item.es}</Text>
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
          sections={this.groupCardsIntoSections()}
          renderItem={this.renderListItem}
          renderSectionHeader={this.renderSectionHeader}
          keyExtractor={(item, index) => item.cardId} />
      </ScrollView>

      <ActionButton
        buttonColor={Colors.tintColor}
        onPress={this.props.showAddCardScreen} />
    </View>
  }
}