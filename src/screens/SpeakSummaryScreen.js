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
  },
  listItemDisabled: {
    color: 'gray',
  },
  listItemCategory: {
    fontSize: 24,
    paddingLeft: 10,
    flex: 1,
  },
  listItemNumMatureCards: {
    fontSize: 24,
    paddingRight: 10,
    width: 40,
    textAlign: 'right',
  },
  listItemNumImmatureCards: {
    fontSize: 24,
    paddingRight: 10,
    width: 40,
    textAlign: 'right',
  },
})

type CategoryAndNumCards = {
  category: string,
  numMatureCards: number,
  numImmatureCards: number,
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
      .map((category: string) => {
        const cards = speakCardsByCategory[category]
        const now = new Date().getTime() / 1000
        const numMatureCards =
          cards.filter(card => card.matureAt <= now).length
        const numImmatureCards =
          cards.filter(card => card.matureAt > now).length
        return { category, numMatureCards, numImmatureCards }
      })
  }

  renderListItem = (item: { item: CategoryAndNumCards }) => {
    const { category, numMatureCards, numImmatureCards } = item.item
    if (numMatureCards === 0) {
      return <View key={category} style={styles.listItem}>
        <Text style={[styles.listItemCategory, styles.listItemDisabled]}>
          {category}
        </Text>
        <Text style={[styles.listItemNumMatureCards, styles.listItemDisabled]}>
          {numMatureCards}
        </Text>
        <Text style={[styles.listItemNumImmatureCards, styles.listItemDisabled]}>
          {numImmatureCards}
        </Text>
      </View>
    } else {
      return <TouchableOpacity
        key={category}
        style={styles.listItem}
        onPress={() => this.props.startSpeakQuiz(category)}>
        <Text style={styles.listItemCategory}>{category}</Text>
        <Text style={styles.listItemNumMatureCards}>{numMatureCards}</Text>
        <Text style={styles.listItemNumImmatureCards}>{numImmatureCards}</Text>
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
