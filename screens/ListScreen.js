import React from 'react'
import {
  Button,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import type { Noun } from '../model/Noun'

type Props = {|
  addNoun: () => void,
  nouns: Array<Noun>,
|}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: 30,
  },
  englishColumn: {
    flex: 1,
  },
  spanishColumn: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
  columnHeader: {
    fontWeight: 'bold',
  },
})

export default class HomeScreen extends React.PureComponent<Props> {
  render() {
    return <View style={styles.container}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Button onPress={this.props.addNoun} title="Add noun" />

        <View style={styles.row}>
          <Text style={[styles.englishColumn, styles.columnHeader]}>English</Text>
          <Text style={[styles.spanishColumn, styles.columnHeader]}>Spanish</Text>
        </View>

        {this.props.nouns.map(noun => {
          return <View key={noun.id} style={styles.row}>
            <Text style={styles.englishColumn}>{noun.en}</Text>
            <Text style={styles.spanishColumn}>{noun.es}</Text>
          </View>
        })}
      </ScrollView>
    </View>
  }
}