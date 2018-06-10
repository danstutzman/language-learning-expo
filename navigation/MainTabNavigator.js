import React from 'react'
import { Platform } from 'react-native'
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation'

import EditNounScreen from '../screens/EditNounScreen'
import TabBarIcon from '../components/TabBarIcon'
import HomeScreen from '../screens/HomeScreen'
import LinksScreen from '../screens/LinksScreen'
import ListScreen from '../screens/ListScreen'
import SettingsScreen from '../screens/SettingsScreen'
import type { Noun } from '../model/Noun'

type ScreenProps = {
  nouns: Array<Noun>,
  addNoun: (noun: Noun) => void,
  deleteNoun: (noun: Noun) => void,
  editNoun: (noun: Noun) => void,
}

const ListStack = createStackNavigator({
  EditNounScreen: {
    screen: (args: {navigation: any, screenProps: ScreenProps }) => {
      const { nounId } = args.navigation.state.params || { nounId: undefined }
      const initialNoun = args.screenProps.nouns.find(noun => noun.id === nounId) ||
        { id: -1, en: '', es: '' }
      return <EditNounScreen
        addNoun={args.screenProps.addNoun}
        deleteNoun={args.screenProps.deleteNoun}
        editNoun={args.screenProps.editNoun}
        initialNoun={initialNoun} />
    },
    navigationOptions: (args: {navigation: any}) => {
      const { nounId } = args.navigation.state.params || { nounId: undefined }
      return { title: (nounId === undefined) ? 'Add Noun' : 'Edit Noun' }
    },
  },
  ListNouns: {
    header: null,
    screen: (args: {navigation: any, screenProps: ScreenProps }) =>
      <ListScreen
        showAddNounScreen={() => { args.navigation.navigate('EditNounScreen') }}
        showEditNounScreen={(nounId: number) => {
          args.navigation.navigate('EditNounScreen', { nounId })
        }}
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