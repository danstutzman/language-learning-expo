import React from 'react'
import { Platform, StatusBar, StyleSheet, View } from 'react-native'
import { AppLoading, Asset, Font } from 'expo'
import { Ionicons } from '@expo/vector-icons'

import RootNavigation from './navigation/RootNavigation'
import DbModel from './model/DbModel'
import type { Card } from './model/Card'

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
  cards: Array<Card>,
}

export default class App extends React.PureComponent<Props, State> {
  model: DbModel

  constructor() {
    super()
    this.model = new DbModel()
    this.state = {
      isLoadingComplete: false,
      cards: [],
    }
  }

  componentDidMount() {
    this.model.loadCards().then(cards => this.setState({ cards }))
  }

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return <AppLoading
        startAsync={this._loadResourcesAsync}
        onError={this._handleLoadingError}
        onFinish={this._handleFinishLoading} />
    } else {
      return <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        <RootNavigation
          addCard={(card: Card) =>
            this.model.addCard(card)
              .then(cards => this.setState({ cards }))
          }
          deleteCard={(card: Card) =>
            this.model.deleteCard(card)
              .then(cards => this.setState({ cards }))
          }
          editCard={(card: Card) =>
            this.model.editCard(card)
              .then(cards => this.setState({ cards }))
          }
          cards={this.state.cards} />
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

