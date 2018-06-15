import { AppLoading, Asset, Font } from 'expo'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Alert, Platform, StatusBar, StyleSheet, View } from 'react-native'
import { email } from 'react-native-communications'

import type { Card } from './src/model/Card'
import DbModel from './src/model/DbModel'
import type { Exposure } from './src/model/Exposure'
import type { Model } from './src/model/Model'
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
  model: Model,
}

export default class App extends React.PureComponent<Props, State> {
  dbModel: DbModel

  constructor() {
    super()
    this.dbModel = new DbModel()
    this.state = {
      isLoadingComplete: false,
      model: {
        allCards: [],
        cardIdToCategory: {},
        speakCards: [],
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
          addCard={(card: Card) => {
            this.dbModel.addCard(card)
              .then(model => this.setState({ model }))
          }}
          addExposure={(exposure: Exposure) => {
            this.dbModel.addExposure(exposure)
              .then(model => this.setState({ model }))
          }}
          deleteCard={(card: Card) => {
            this.dbModel.deleteCard(card)
              .then(model => this.setState({ model }))
          }}
          editCard={(card: Card) => {
            this.dbModel.editCard(card)
              .then(model => this.setState({ model }))
          }}
          exportDatabase={() =>
            email(null, null, null, 'Lang learning export',
              this.dbModel.serializeForEmail())}
          reseedDatabase={() =>
            this.dbModel.reseedDatabase()
              .then(model => this.setState({ model }))
              .then(() => Alert.alert(
                'Reseed finished',
                'Reseed finished',
                [{ text: 'OK' }],
                { cancelable: false }))
          }
          model={this.state.model} />
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
      this.dbModel.init()
        .then((model: Model) => this.setState({ model }))
    ])
  }
}