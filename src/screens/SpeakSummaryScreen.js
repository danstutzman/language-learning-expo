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
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listItemDisabled: {
    color: 'gray',
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

type CategoryAndNumCards = {
  category: string,
  numCards: number,
}

export const CATEGORIES = [
  'UNTESTED',
  'BROKEN',
  'REMEMBERED_1X',
  'REMEMBERED_2X',
  'REMEMBERED_5MIN',
  'REMEMBERED_1HOUR',
  'REMEMBERED_1DAY',
]

export default class SpeakSummaryScreen extends React.PureComponent<Props> {
  summarizeCategories = (): Array<CategoryAndNumCards> => {
    const { speakCardsByCategory } = this.props.model
    return Object.keys(speakCardsByCategory)
      .map((category: string) => ({
        category,
        numCards: speakCardsByCategory[category].length,
      }))
  }

  renderListItem = (item: { item: CategoryAndNumCards }) => {
    const { category, numCards } = item.item
    if (numCards === 0) {
      return <View key={category} style={styles.listItem}>
        <Text style={[styles.listItemCategory, styles.listItemDisabled]}>
          {category}
        </Text>
        <Text style={[styles.listItemNumCards, styles.listItemDisabled]}>
          {numCards}
        </Text>
      </View>
    } else {
      return <TouchableOpacity
        key={category}
        style={styles.listItem}
        onPress={() => this.props.startSpeakQuiz(category)}>
        <Text style={styles.listItemCategory}>{category}</Text>
        <Text style={styles.listItemNumCards}>{numCards}</Text>
      </TouchableOpacity>
    }
  }

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
