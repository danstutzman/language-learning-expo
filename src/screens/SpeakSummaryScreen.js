import React from 'react'
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import type { Model } from '../model/Model'

type Props = {|
  model: Model,
  startSpeakQuiz: (category: string) => void,
|}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: 30,
  },
  categoryTitle: {
    fontWeight: 'bold',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listItemCategory: {
    fontSize: 24,
    paddingLeft: 10,
  },
  listItemNumCards: {
    fontSize: 24,
    paddingRight: 10,
  },
})

const CATEGORIES = ['BROKEN', 'FIRST_TIME', 'SUCCEEDED']

type CategoryAndNumCards = {
  category: string,
  numCards: number,
}

export default class SpeakSummaryScreen extends React.PureComponent<Props> {
  summarizeCategories(): Array<CategoryAndNumCards> {
    const categoryToNumCards: {[string]: number} = {}
    const { speakCards, cardIdToCategory } = this.props.model
    for (const card of speakCards) {
      const category = cardIdToCategory[card.cardId]
      if (categoryToNumCards[category] === undefined) {
        categoryToNumCards[category] = 0
      }
      categoryToNumCards[category] += 1
    }

    return CATEGORIES.map(category => ({
      category,
      numCards: categoryToNumCards[category] || 0,
    }))
  }

  renderListItem = (item: { item: CategoryAndNumCards }) =>
    <TouchableOpacity
      key={item.item.category}
      style={styles.listItem}
      onPress={() => this.props.startSpeakQuiz(item.item.category)}>
      <Text style={styles.listItemCategory}>{item.item.category}</Text>
      <Text style={styles.listItemNumCards}>{item.item.numCards}</Text>
    </TouchableOpacity>

  render() {
    return <View style={styles.container}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <FlatList
          data={this.summarizeCategories()}
          keyExtractor={item => item.category}
          renderItem={this.renderListItem} />
      </ScrollView>
    </View>
  }
}
