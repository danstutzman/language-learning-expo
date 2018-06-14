import React from 'react'
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import type { Card } from '../model/Card'

type Props = {|
  allCards: Array<Card>,
  showAddCardScreen: () => void,
  showEditCardScreen: (cardId: number) => void,
|}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: 30,
  },
  cardIdColumn: {
    width: 20,
  },
  englishColumn: {
    flex: 1,
  },
  spanishColumn: {
    flex: 1,
  },
  typeColumn: {
    width: 40,
  },
  editColumn: {
    width: 20,
  },
  row: {
    flexDirection: 'row',
  },
  columnHeader: {
    fontWeight: 'bold',
  },
})

export default class EditCardsScreen extends React.PureComponent<Props> {
  render() {
    return <View style={styles.container}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Button onPress={this.props.showAddCardScreen} title="Add card" />

        <View style={styles.row}>
          <Text style={[styles.cardIdColumn, styles.columnHeader]}>ID</Text>
          <Text style={[styles.typeColumn, styles.columnHeader]}>Type</Text>
          <Text style={[styles.englishColumn, styles.columnHeader]}>English</Text>
          <Text style={[styles.spanishColumn, styles.columnHeader]}>Spanish</Text>
          <Text style={[styles.editColumn, styles.columnHeader]}></Text>
        </View>

        {this.props.allCards.map(card => {
          return <View key={card.cardId} style={styles.row}>
            <Text style={styles.cardIdColumn}>{card.cardId}</Text>
            <Text style={styles.typeColumn}>{card.type}</Text>
            <Text style={styles.englishColumn}>{card.en}</Text>
            <Text style={styles.spanishColumn}>{card.es}</Text>
            <Button
              onPress={() => this.props.showEditCardScreen(card.cardId)}
              style={styles.editColumn}
              title="Edit" />
          </View>
        })}
      </ScrollView>
    </View>
  }
}