import React from 'react'
import { Platform } from 'react-native'
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation'

import { BLANK_CARD } from '../model/Card'
import type { Card } from '../model/Card'
import EditCardScreen from '../screens/EditCardScreen'
import EditCardsScreen from '../screens/EditCardsScreen'
import TabBarIcon from '../components/TabBarIcon'
import LinksScreen from '../screens/LinksScreen'
import SettingsScreen from '../screens/SettingsScreen'
import SpeakSummaryScreen from '../screens/SpeakSummaryScreen'
import SpeakQuizScreen from '../screens/SpeakQuizScreen'

type ScreenProps = {
  cards: Array<Card>,
  addCard: (card: Card) => void,
  deleteCard: (card: Card) => void,
  editCard: (card: Card) => void,
}

const EditStack = createStackNavigator({
  EditCardScreen: {
    screen: (args: {navigation: any, screenProps: ScreenProps }) => {
      const { cardId } = args.navigation.state.params || { cardId: undefined }
      const initialCard = args.screenProps.cards.find(card =>
        card.cardId === cardId) || BLANK_CARD
      return <EditCardScreen
        addCard={args.screenProps.addCard}
        deleteCard={args.screenProps.deleteCard}
        editCard={args.screenProps.editCard}
        initialCard={initialCard} />
    },
    navigationOptions: (args: {navigation: any}) => {
      const { cardId } = args.navigation.state.params || { cardId: undefined }
      return { title: (cardId === undefined) ? 'Add Card' : 'Edit Card' }
    },
  },
  EditCards: {
    header: null,
    screen: (args: {navigation: any, screenProps: ScreenProps }) =>
      <EditCardsScreen
        showAddCardScreen={() => { args.navigation.navigate('EditCardScreen') }}
        showEditCardScreen={(cardId: number) => {
          args.navigation.navigate('EditCardScreen', { cardId })
        }}
        cards={args.screenProps.cards} />,
    navigationOptions: () => ({
      title: 'Edit Cards',
    }),
  }
}, {
  initialRouteName: 'EditCards',
  navigationOptions: {
    headerStyle: {
      backgroundColor: '#fff',
    },
    headerTintColor: 'black',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  },
})

EditStack.navigationOptions = {
  tabBarLabel: 'Edit',
  tabBarIcon: (args: { focused: boolean }) =>
    <TabBarIcon
      focused={args.focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${args.focused ? '' : '-outline'}`
          : 'md-information-circle'
      } />,
}

const SpeakStack = createStackNavigator({
  Speak: {
    header: null,
    screen: (args: {navigation: any, screenProps: ScreenProps }) =>
      <SpeakSummaryScreen
        cards={args.screenProps.cards}
        startSpeakQuiz={() => {
          args.navigation.navigate('SpeakQuiz')
        }} />,
    title: 'Speak',
  },
  SpeakQuiz: {
    header: null,
    screen: (args: {navigation: any, screenProps: ScreenProps }) =>
      <SpeakQuizScreen
        topCard={args.screenProps.cards[0]} />,
    title: 'Speak',
  }
})

SpeakStack.navigationOptions = {
  tabBarLabel: 'Speak',
  tabBarIcon: (args: { focused: boolean }) =>
    <TabBarIcon
      focused={args.focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${args.focused ? '' : '-outline'}`
          : 'md-information-circle'
      } />,
}

const LinksStack = createStackNavigator({
  Links: {
    screen: LinksScreen,
    title: 'Links',
  }
})

LinksStack.navigationOptions = {
  tabBarLabel: 'Links',
  tabBarIcon: (args: { focused: boolean }) =>
    <TabBarIcon
      focused={args.focused}
      name={Platform.OS === 'ios' ? `ios-link${args.focused ? '' : '-outline'}` : 'md-link'}
    />,
}

const SettingsStack = createStackNavigator({
  Settings: {
    screen: SettingsScreen,
    title: 'Settings',
  }
})

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: (args: { focused: boolean }) =>
    <TabBarIcon
      focused={args.focused}
      name={Platform.OS === 'ios' ?
        `ios-options${args.focused ? '' : '-outline'}` :
        'md-options'} />,
}

export default createBottomTabNavigator({
  EditStack,
  SpeakStack,
  LinksStack,
  SettingsStack,
})
