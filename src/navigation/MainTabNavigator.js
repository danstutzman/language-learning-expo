import React from 'react'
import { Platform, Text } from 'react-native'
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation'

import { BLANK_CARD } from '../model/Card'
import EditCardScreen from '../screens/EditCardScreen'
import EditCardsScreen from '../screens/EditCardsScreen'
import TabBarIcon from '../components/TabBarIcon'
import LinksScreen from '../screens/LinksScreen'
import type { ScreenProps } from './ScreenProps'
import SettingsScreen from '../screens/SettingsScreen'
import SpeakSummaryScreen from '../screens/SpeakSummaryScreen'
import SpeakQuizScreen from '../screens/SpeakQuizScreen'

const EditStack = createStackNavigator({
  EditCardScreen: {
    screen: (args: {navigation: any, screenProps: ScreenProps }) => {
      const { cardId } = args.navigation.state.params || { cardId: undefined }
      const initialCard = args.screenProps.model.allCards.find(card =>
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
        exportDatabase={args.screenProps.exportDatabase}
        reseedDatabase={args.screenProps.reseedDatabase}
        showAddCardScreen={() => { args.navigation.navigate('EditCardScreen') }}
        showEditCardScreen={(cardId: number) => {
          args.navigation.navigate('EditCardScreen', { cardId })
        }}
        allCards={args.screenProps.model.allCards} />,
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
    screen: (args: {navigation: any, screenProps: ScreenProps }) =>
      <SpeakSummaryScreen
        model={args.screenProps.model}
        startSpeakQuiz={(category: string) => {
          args.navigation.navigate('SpeakQuiz', { category })
        }} />,
    navigationOptions: () => ({
      title: 'Speak in Spanish',
    }),
  },
  SpeakQuiz: {
    screen: (args: {navigation: any, screenProps: ScreenProps }) => {
      const { category } = args.navigation.state.params
      const { cardIdToCategory, speakCards } = args.screenProps.model
      const topCard = speakCards.filter(card =>
        cardIdToCategory[card.cardId] === category)[0]
      if (topCard === undefined) {
        return <Text>no cards in this category</Text>
      } else {
        return <SpeakQuizScreen
          card={topCard}
          exposeCard={(remembered: boolean) =>
            args.screenProps.addExposure({
              exposureId: 0,
              cardId: topCard.cardId,
              remembered,
              createdAtSeconds: new Date().getTime() / 1000,
            })
          }
          suspendCard={() =>
            args.screenProps.editCard({ ...topCard, suspended: true })} />
      }
    },
    navigationOptions: () => ({
      title: 'Speak in Spanish',
    }),
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
