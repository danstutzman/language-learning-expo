import React from 'react'
import { Speech } from 'expo'
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { FontAwesome } from '@expo/vector-icons'

import type { Card } from '../model/Card'
import type { Leaf } from '../model/Leaf'

type Props = {|
  card: Card,
  exposeLeaf: (leafId: number, remembered: boolean) => void,
|}

type State = {|
  rememberedByLeafId: {[number]: boolean},
  secondsLeft: number,
  showMnemonic: boolean,
|}

const SECONDS_LEFT_TO_ICON = {
  '3': 'hourglass-start',
  '2': 'hourglass-half',
  '1': 'hourglass-end',
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
  },
  question: {
    flex: 1,
    justifyContent: 'center', // center vertically
    alignItems: 'center', // center horizontally
  },
  instructions: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 10,
  },
  hourglass: {
    marginRight: 10,
    marginTop: 10,
    marginLeft: 'auto', // float right
  },
  englishToTranslate: {
    fontVariant: ['small-caps'],
    fontSize: 40,
  },
  gloss_table: {
    flex: 1,
    justifyContent: 'center', // center vertically
  },
  gloss_table_row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gloss_table_english: {
    fontVariant: ['small-caps'],
    fontSize: 40,
    marginLeft: 10,
  },
  gloss_table_spanish: {
    fontSize: 40,
    fontStyle: 'italic',
    textAlign: 'right',
    marginRight: 10,
    marginLeft: 'auto', // float right
  },
  forgotten: {
    color: 'red',
  },
  remembered: {
    color: 'green',
  },
})

export default class SpeakQuizScreen extends React.PureComponent<Props, State> {
  countdown: IntervalID

  constructor(props: Props) {
    super(props)
    this.state = {
      rememberedByLeafId: {},
      secondsLeft: 3,
      showMnemonic: false,
    }
    this.setInterval()
  }

  componentWillUnmount() {
    clearInterval(this.countdown)
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.card !== prevProps.card) {
      this.setState({
        rememberedByLeafId: {},
        secondsLeft: 3,
        showMnemonic: false,
      }, this.setInterval)
    }
  }

  setInterval() {
    if (this.countdown !== null) {
      clearInterval(this.countdown)
    }
    this.countdown = setInterval(() =>
      this.setState(prevState => {
        if (prevState.secondsLeft === 1) {
          clearInterval(this.countdown)
          this.speakSpanish(this.props.card.leafs)
          return { secondsLeft: 0 }
        } else {
          return { secondsLeft: prevState.secondsLeft - 1 }
        }
      }), 1000)
  }

  pressGlossTableRow = (leaf: Leaf) => {
    clearInterval(this.countdown)
    this.speakSpanish([leaf])
    this.setState(prevState => ({
      rememberedByLeafId: {
        ...prevState.rememberedByLeafId,
        [leaf.leafId]: !prevState.rememberedByLeafId[leaf.leafId],
      },
      secondsLeft: 0,
    }))
  }

  onNext = () => {
    for (const leaf of this.props.card.leafs) {
      this.props.exposeLeaf(
        leaf.leafId,
        this.state.rememberedByLeafId[leaf.leafId] || false)
    }
  }

  speakSpanish = (leafs: Array<Leaf>) => {
    const es = leafs.map(leaf => leaf.es).join(' ').replace(/- -/g, '')
    Speech.speak(es, { language: 'es', rate: 0.5 })
  }

  render() {
    return <View style={styles.container}>
      <Text style={styles.instructions}>Tap word when you remember</Text>
      <View style={styles.gloss_table}>
        {this.props.card.leafs.map(leaf =>
          <TouchableOpacity
            key={leaf.leafId}
            onPress={() => this.pressGlossTableRow(leaf)}>
            <View style={styles.gloss_table_row}>
              <Text style={styles.gloss_table_english}>
                {this.state.secondsLeft > 0 && leaf.en.startsWith('(') ?
                  '' : leaf.en}
              </Text>
              {this.state.secondsLeft > 0 ?
                <FontAwesome
                  style={styles.hourglass}
                  name={SECONDS_LEFT_TO_ICON[this.state.secondsLeft]}
                  size={26}
                  color="#ddd" /> :
                <Text style={[
                  styles.gloss_table_spanish,
                  this.state.rememberedByLeafId[leaf.leafId] ?
                    styles.remembered : styles.forgotten,
                ]}>
                  {leaf.es}
                </Text>}
            </View>
          </TouchableOpacity>)}
      </View>

      <Button onPress={this.onNext} title='Next' />
    </View>
  }
}
