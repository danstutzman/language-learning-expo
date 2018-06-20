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
  listItemEn: {
    fontSize: 24,
    paddingRight: 10,
    width: 100,
    textAlign: 'right',
  },
})

export default class SpeakSummaryScreen extends React.PureComponent<Props> {
  renderListItem = (item: { item: Skill }) => {
    const skill = item.item
    const { cardId } = skill
    const es = skill.card.getGlossRows().map(row =>
      row.es).join(' ').replace('- -', '')

    return <TouchableOpacity
      key={cardId}
      style={styles.listItem}
      onPress={() => this.props.startSpeakQuiz(cardId)}>
      <Text style={styles.listItemEs}>{cardId} {es}</Text>
      <Text style={styles.listItemEn}>{skill.delay}</Text>
    </TouchableOpacity>
  }

  render() {
    return <View style={styles.container}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <FlatList
          data={Object.values(this.props.bankModel.skillByCardId)}
          keyExtractor={item => item.card.cardId.toString()}
          renderItem={this.renderListItem} />
      </ScrollView>
    </View>
  }
}
