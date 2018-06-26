import { AppLoading, Asset, Font, SQLite } from 'expo'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Platform, StatusBar, StyleSheet, View } from 'react-native'

import Backend from './src/backend/Backend'
import Bank from './src/cards/Bank'
import type { BankModel } from './src/cards/BankModel'
import type { Card } from './src/cards/Card'
import type { CardUpdate } from './src/cards/CardUpdate'
import RootNavigation from './src/navigation/RootNavigation'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
})

type Props = {
  skipLoadingScreen: boolean,
}

type State = {
  isLoadingComplete: boolean,
  bankModel: BankModel,
}

const db = SQLite.openDatabase('db.db')
const bank = new Bank(db)
const backend = new Backend('https://19c6e841.ngrok.io/api')

export default class App extends React.PureComponent<Props, State> {
  constructor() {
    super()
    this.state = {
      isLoadingComplete: false,
      bankModel: {
        ancestorCardIdsByCardId: {},
        cardByCardId: {},
        descendantCardIdsByCardId: {},
        leafIdToLeafCardId: {},
        stageToCardIds: {},
      },
    }
  }

  render() {
    if (!this.state.isLoadingComplete) { //} && !this.props.skipLoadingScreen) {
      return <AppLoading
        startAsync={this._loadResourcesAsync}
        onError={(e: Error) => console.warn(e)}
        onFinish={() => this.setState({ isLoadingComplete: true })} />
    } else {
      return <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        <RootNavigation
          deleteDatabase={() =>
            bank.deleteDatabase()
              .then(bankModel => this.setState({ bankModel }))}
          downloadDatabase={() =>
            backend.downloadDatabase()
              .then((download: { cards: Array<Card> }) =>
                bank.replaceDatabase(download.cards))
              .then(bankModel => this.setState({ bankModel }))}
          updateCards={(cardUpdates: Array<CardUpdate>) =>
            bank.updateCards(cardUpdates)
              .then(bankModel => this.setState({ bankModel }))}
          uploadDatabase={() => Promise.resolve()} // TODO
          bankModel={this.state.bankModel} />
      </View>
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/robot-dev.png'),
        require('./assets/images/robot-prod.png'),
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      }),
      bank.init([])
        .then(bankModel => this.setState({ bankModel }))
    ])
  }
}
