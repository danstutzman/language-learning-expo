import { AppLoading, Asset, Font } from 'expo'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Alert, Platform, StatusBar, StyleSheet, View } from 'react-native'
import { email } from 'react-native-communications'

import DbModel from './src/model/DbModel'
import type { Exposure } from './src/model/Exposure'
import type { Leaf } from './src/model/Leaf'
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
        allLeafs: [],
        speakCardsByCategory: {},
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
          addLeaf={(card: Leaf) => {
            this.dbModel.addLeaf(card)
              .then(model => this.setState({ model }))
          }}
          deleteLeaf={(card: Leaf) => {
            this.dbModel.deleteLeaf(card)
              .then(model => this.setState({ model }))
          }}
          editLeaf={(card: Leaf) => {
            this.dbModel.editLeaf(card)
              .then(model => this.setState({ model }))
          }}
          exportDatabase={() => {
            const body = this.dbModel.serializeForEmail()
            // eslint-disable-next-line no-console
            console.warn('Email body', body)
            email(null, null, null, 'Lang learning export', body)
          }}
          exposeLeafs={(exposures: Array<Exposure>) => {
            this.dbModel.exposeLeafs(exposures)
              .then(model => this.setState({ model }))
          }}
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