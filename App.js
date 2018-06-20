import { AppLoading, Asset, Font, SQLite } from 'expo'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Alert, Platform, StatusBar, StyleSheet, View } from 'react-native'
import { email } from 'react-native-communications'

import Bank from './src/cards/Bank'
import type { BankModel } from './src/cards/BankModel'
import RootNavigation from './src/navigation/RootNavigation'
import seeds from './src/cards/seeds/seeds'

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

export default class App extends React.PureComponent<Props, State> {
  constructor() {
    super()
    this.state = {
      isLoadingComplete: false,
      bankModel: {
        cardByCardId: {},
        parentCardsByCardId: {},
        skillByCardId: {},
      }
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
          exportDatabase={() => {
            const body = bank.exportDatabase()
            // eslint-disable-next-line no-console
            console.warn('Email body', body)
            email(null, null, null, 'Lang learning export', body)
          }}
          reseedDatabase={() =>
            bank.reseedDatabase(seeds)
              .then(bankModel => this.setState({ bankModel }))
              .then(() => Alert.alert(
                'Reseed finished',
                'Reseed finished',
                [{ text: 'OK' }],
                { cancelable: false }))
          }
          updateSkills={skillUpdates =>
            bank.updateSkills(skillUpdates)
              .then(bankModel => this.setState({ bankModel })) }
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
      bank.init(seeds)
        .then(bankModel => this.setState({ bankModel }))
    ])
  }
}