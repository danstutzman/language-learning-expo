import React from 'react'
import { Platform } from 'react-native'
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation'

import { BLANK_CARD } from '../model/Card'
import EditCardScreen from '../screens/EditCardScreen'
import TabBarIcon from '../components/TabBarIcon'
import HomeScreen from '../screens/HomeScreen'
import LinksScreen from '../screens/LinksScreen'
import ListScreen from '../screens/ListScreen'
import SettingsScreen from '../screens/SettingsScreen'
import type { Card } from '../model/Card'

type ScreenProps = {
  cards: Array<Card>,
  addCard: (card: Card) => void,
  deleteCard: (card: Card) => void,
  editCard: (card: Card) => void,
}

const ListStack = createStackNavigator({
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
  ListCards: {
    header: null,
    screen: (args: {navigation: any, screenProps: ScreenProps }) =>
      <ListScreen
        showAddCardScreen={() => { args.navigation.navigate('EditCardScreen') }}
        showEditCardScreen={(cardId: number) => {
          args.navigation.navigate('EditCardScreen', { cardId })
        }}
        cards={args.screenProps.cards} />,
    navigationOptions: () => ({
      title: 'List Cards',
    }),
  }
}, {
  initialRouteName: 'ListCards',
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

ListStack.navigationOptions = {
  tabBarLabel: 'List',
  tabBarIcon: (args: { focused: boolean }) =>
    <TabBarIcon
      focused={args.focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${args.focused ? '' : '-outline'}`
          : 'md-information-circle'
      } />,
}

const HomeStack = createStackNavigator({
  Home: {
    header: null,
    screen: (args: { screenProps: ScreenProps }) =>
      <HomeScreen
        cards={args.screenProps.cards} />,
    title: 'Home',
  }
})

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
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
  ListStack,
  HomeStack,
  LinksStack,
  SettingsStack,
})