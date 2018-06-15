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
  listItemDisabled: {
    color: 'gray',
  },
  listItemCategory: {
    fontSize: 24,
    paddingLeft: 10,
  },
  listItemNumLeafs: {
    fontSize: 24,
    paddingRight: 10,
  },
})

const CATEGORIES = ['BROKEN', 'FIRST_TIME', 'SUCCEEDED']

type CategoryAndNumLeafs = {
  category: string,
  numLeafs: number,
}

export default class SpeakSummaryScreen extends React.PureComponent<Props> {
  summarizeCategories(): Array<CategoryAndNumLeafs> {
    const categoryToNumLeafs: {[string]: number} = {}
    const { speakLeafs, leafIdToCategory } = this.props.model
    for (const leaf of speakLeafs) {
      const category = leafIdToCategory[leaf.leafId]
      if (categoryToNumLeafs[category] === undefined) {
        categoryToNumLeafs[category] = 0
      }
      categoryToNumLeafs[category] += 1
    }

    return CATEGORIES.map(category => ({
      category,
      numLeafs: categoryToNumLeafs[category] || 0,
    }))
  }

  renderListItem = (item: { item: CategoryAndNumLeafs }) => {
    const { category, numLeafs } = item.item
    if (numLeafs === 0) {
      return <View key={category} style={styles.listItem}>
        <Text style={[styles.listItemCategory, styles.listItemDisabled]}>
          {category}
        </Text>
        <Text style={[styles.listItemNumLeafs, styles.listItemDisabled]}>
          {numLeafs}
        </Text>
      </View>
    } else {
      return <TouchableOpacity
        key={category}
        style={styles.listItem}
        onPress={() => this.props.startSpeakQuiz(category)}>
        <Text style={styles.listItemCategory}>{category}</Text>
        <Text style={styles.listItemNumLeafs}>{numLeafs}</Text>
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
