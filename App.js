import React from 'react'
import { Platform, StatusBar, StyleSheet, View } from 'react-native'
import { AppLoading, Asset, Font } from 'expo'
import { Ionicons } from '@expo/vector-icons'

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
        onError={this._handleLoadingError}
        onFinish={this._handleFinishLoading} />
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

  _handleLoadingError = (error: any) => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error)
  }

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true })
  }
}