import React from 'react'
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import type { Model } from '../model/Model'

type Props = {|
  model: Model,
  startSpeakQuiz: () => void,
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
})

const CATEGORIES = ['BROKEN', 'FIRST_TIME', 'SUCCEEDED']

export default class SpeakSummaryScreen extends React.PureComponent<Props> {
  render() {
    return <View style={styles.container}>
      <Button onPress={this.props.startSpeakQuiz} title='Start Quiz' />
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {CATEGORIES.map(category =>
          <View key={category}>
            <Text style={styles.categoryTitle}>{category}</Text>
            {(this.props.model.speakCardsByCategory[category] || []).map(card =>
              <Text key={card.cardId}>{card.es}</Text>)}
          </View>)}
      </ScrollView>
    </View>
  }
}
