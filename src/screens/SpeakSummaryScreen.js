import React from 'react'
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import type { BankModel } from '../cards/BankModel'
import type { Skill } from '../cards/Skill'

type Props = {|
  bankModel: BankModel,
  startSpeakQuiz: (cardId: number) => void,
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
  listItemEs: {
    fontSize: 24,
    paddingLeft: 10,
    flex: 1,
  },
  listItemDelay: {
    fontSize: 24,
    paddingRight: 10,
    width: 100,
    textAlign: 'right',
  },
  listItemEndurance: {
    fontSize: 24,
    paddingRight: 10,
    width: 100,
    textAlign: 'right',
  },
})

function formatDuration(numSeconds: number): string {
  if (numSeconds === 0) {
    return ''
  } else if (numSeconds < 60) {
    return `${numSeconds}s`
  } else if (numSeconds < 60 * 60) {
    return `${Math.floor(numSeconds / 60)}m`
  } else if (numSeconds < 24 * 60 * 60) {
    return `${Math.floor(numSeconds / (60 * 60))}h`
  } else {
    return `${Math.floor(numSeconds / (24 * 60 * 60))}d`
  }
}

export default class SpeakSummaryScreen extends React.PureComponent<Props> {
  renderListItem = (item: { item: Skill }) => {
    const skill = item.item
    const { cardId } = skill
    const card = this.props.bankModel.cardByCardId[cardId]

    return <TouchableOpacity
      key={cardId}
      style={styles.listItem}
      onPress={() => this.props.startSpeakQuiz(cardId)}>
      <Text style={styles.listItemEs}>
        {cardId}
        {' '}
        {card.esWords.join(' ').replace(' .', '.')}
      </Text>
      <Text style={styles.listItemDelay}>
        {skill.delay >= 1000
          ? Math.floor(skill.delay / 1000)
          : Math.floor(skill.delay / 100) / 10}
      </Text>
      <Text style={styles.listItemEndurance}>
        {formatDuration(skill.endurance)}
      </Text>
    </TouchableOpacity>
  }

  render() {
    return <View style={styles.container}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <FlatList
          data={Object.values(this.props.bankModel.skillByCardId)}
          keyExtractor={item => item.cardId.toString()}
          renderItem={this.renderListItem} />
      </ScrollView>
    </View>
  }
}
