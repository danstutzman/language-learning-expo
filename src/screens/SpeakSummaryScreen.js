import React from 'react'
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import { ALL_STAGES } from '../cards/Stage'
import type { BankModel } from '../cards/BankModel'
import { STAGE_TO_DESCRIPTION } from '../cards/Stage'

type Props = {|
  bankModel: BankModel,
  startSpeakQuiz: (stage: number) => void,
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
  listItemStage: {
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
  stage: number,
  numCards: number,
|}

export default class SpeakSummaryScreen extends React.PureComponent<Props> {
  summarizeListItems = (): Array<ListItem> => {
    const { stageToLeafIdsCsvs } = this.props.bankModel
    const stageToListItem: {[number]: ListItem} = {}
    for (const stage of ALL_STAGES) {
      const leafIdsCsvs = stageToLeafIdsCsvs[stage] || []
      stageToListItem[stage] = { stage, numCards: leafIdsCsvs.length }
    }
    return (Object.values(stageToListItem): any)
  }

  renderListItem = (item: { item: ListItem }) => {
    const { stage, numCards } = item.item
    return <TouchableOpacity
      key={stage}
      style={styles.listItem}
      onPress={() => this.props.startSpeakQuiz(stage)}>
      <Text style={styles.listItemStage}>{STAGE_TO_DESCRIPTION[stage]}</Text>
      <Text style={styles.listItemNumCards}>{numCards}</Text>
    </TouchableOpacity>
  }

  render() {
    return <View style={styles.container}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <FlatList
          data={this.summarizeListItems()}
          keyExtractor={item => item.stage.toString()}
          renderItem={this.renderListItem} />
      </ScrollView>
    </View>
  }
}
