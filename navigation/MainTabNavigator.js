import React from 'react'
import { Platform } from 'react-native'
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation'

import TabBarIcon from '../components/TabBarIcon'
import HomeScreen from '../screens/HomeScreen'
import LinksScreen from '../screens/LinksScreen'
import SettingsScreen from '../screens/SettingsScreen'

const HomeStack = createStackNavigator({
  Home: {
    header: null,
    screen: HomeScreen,
    title: 'Home',
  }
})

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: (args: { focused: boolean }) => (
    <TabBarIcon
      focused={args.focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${args.focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
}

const LinksStack = createStackNavigator({
  Links: {
    screen: LinksScreen,
    title: 'Links',
  }
})

LinksStack.navigationOptions = {
  tabBarLabel: 'Links',
  tabBarIcon: (args: { focused: boolean }) => (
    <TabBarIcon
      focused={args.focused}
      name={Platform.OS === 'ios' ? `ios-link${args.focused ? '' : '-outline'}` : 'md-link'}
    />
  ),
}

const SettingsStack = createStackNavigator({
  Settings: {
    screen: SettingsScreen,
    title: 'Settings',
  }
})

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: (args: { focused: boolean }) => (
    <TabBarIcon
      focused={args.focused}
      name={Platform.OS === 'ios' ? `ios-options${args.focused ? '' : '-outline'}` : 'md-options'}
    />
  ),
}

export default createBottomTabNavigator({
  HomeStack,
  LinksStack,
  SettingsStack,
})
