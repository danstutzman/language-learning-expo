import React from 'react'
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import { ALL_CATEGORIES } from '../cards/Category'
import type { BankModel } from '../cards/BankModel'
import type { Category } from '../cards/Category'

type Props = {|
  bankModel: BankModel,
  startSpeakQuiz: (category: Category) => void,
|}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: 30,
  },
  listItem: {
    flexDirection: 'row',
  },
  listItemDisabled: {
    color: 'gray',
  },
  listItemCategory: {
    fontSize: 20,
    paddingLeft: 10,
    flex: 1,
  },
  listItemNumCards: {
    fontSize: 20,
    paddingRight: 10,
    width: 80,
    textAlign: 'right',
  },
})

type ListItem = {|
  category: Category,
  numCards: number,
|}

export default class SpeakSummaryScreen extends React.PureComponent<Props> {
  summarizeListItems = (): Array<ListItem> => {
    const { categoryToCardIds } = this.props.bankModel
    const categoryToListItem: {[string]: ListItem} = {}
    for (const category of ALL_CATEGORIES) {
      const cardIds = categoryToCardIds[category] || []
      categoryToListItem[category] = { category, numCards: cardIds.length }
    }
    return (Object.values(categoryToListItem): any)
  }

  renderListItem = (item: { item: ListItem }) => {
    const { category, numCards } = item.item
    return <TouchableOpacity
      key={category}
      style={styles.listItem}
      onPress={() => this.props.startSpeakQuiz(category)}>
      <Text style={styles.listItemCategory}>{category}</Text>
      <Text style={styles.listItemNumCards}>{numCards}</Text>
    </TouchableOpacity>
  }

  render() {
    return <View style={styles.container}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <FlatList
          data={this.summarizeListItems()}
          keyExtractor={item => item.category}
          renderItem={this.renderListItem} />
      </ScrollView>
    </View>
  }
}
