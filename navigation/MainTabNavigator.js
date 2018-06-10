import React from 'react'
import { Platform } from 'react-native'
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation'

import AddNounScreen from '../screens/AddNounScreen'
import TabBarIcon from '../components/TabBarIcon'
import HomeScreen from '../screens/HomeScreen'
import LinksScreen from '../screens/LinksScreen'
import ListScreen from '../screens/ListScreen'
import SettingsScreen from '../screens/SettingsScreen'
import type { Noun } from '../model/Noun'

type ScreenProps = {
  nouns: Array<Noun>,
  addNoun: () => void,
}

const ListStack = createStackNavigator({
  AddNounScreen: {
    screen: (args: {navigation: any, screenProps: ScreenProps }) =>
      <AddNounScreen
        addNoun={args.screenProps.addNoun}
        nouns={args.screenProps.nouns} />,
    navigationOptions: () => ({
      title: 'Add Noun',
    }),
  },
  ListNouns: {
    header: null,
    screen: (args: {navigation: any, screenProps: ScreenProps }) =>
      <ListScreen
        showAddNounScreen={() => { args.navigation.navigate('AddNounScreen') }}
        nouns={args.screenProps.nouns} />,
    navigationOptions: () => ({
      title: 'List Nouns',
    }),
  }
}, {
  initialRouteName: 'ListNouns',
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
        addNoun={args.screenProps.addNoun}
        nouns={args.screenProps.nouns} />,
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