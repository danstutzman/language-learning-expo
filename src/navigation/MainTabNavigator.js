import React from 'react'
import { Platform, Text } from 'react-native'
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation'

import { BLANK_LEAF } from '../model/Leaf'
import EditLeafScreen from '../screens/EditLeafScreen'
import EditLeafsScreen from '../screens/EditLeafsScreen'
import TabBarIcon from '../components/TabBarIcon'
import LinksScreen from '../screens/LinksScreen'
import type { ScreenProps } from './ScreenProps'
import SettingsScreen from '../screens/SettingsScreen'
import SpeakSummaryScreen from '../screens/SpeakSummaryScreen'
import SpeakQuizScreen from '../screens/SpeakQuizScreen'

const EditStack = createStackNavigator({
  EditLeafScreen: {
    screen: (args: {navigation: any, screenProps: ScreenProps }) => {
      const { leafId } = args.navigation.state.params || { leafId: undefined }
      const initialLeaf = args.screenProps.model.allLeafs.find(leaf =>
        leaf.leafId === leafId) || BLANK_LEAF
      return <EditLeafScreen
        addLeaf={args.screenProps.addLeaf}
        deleteLeaf={args.screenProps.deleteLeaf}
        editLeaf={args.screenProps.editLeaf}
        initialLeaf={initialLeaf} />
    },
    navigationOptions: (args: {navigation: any}) => {
      const { leafId } = args.navigation.state.params || { leafId: undefined }
      return { title: (leafId === undefined) ? 'Add Leaf' : 'Edit Leaf' }
    },
  },
  EditLeafs: {
    header: null,
    screen: (args: {navigation: any, screenProps: ScreenProps }) =>
      <EditLeafsScreen
        exportDatabase={args.screenProps.exportDatabase}
        reseedDatabase={args.screenProps.reseedDatabase}
        showAddLeafScreen={() => { args.navigation.navigate('EditLeafScreen') }}
        showEditLeafScreen={(leafId: number) => {
          args.navigation.navigate('EditLeafScreen', { leafId })
        }}
        allLeafs={args.screenProps.model.allLeafs} />,
    navigationOptions: () => ({
      title: 'Edit Leafs',
    }),
  }
}, {
  initialRouteName: 'EditLeafs',
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
        startSpeakQuiz={() => { args.navigation.navigate('SpeakQuiz') }} />,
    navigationOptions: () => ({
      title: 'Speak in Spanish',
    }),
  },
  SpeakQuiz: {
    screen: (args: {navigation: any, screenProps: ScreenProps }) => {
      const { speakCards } = args.screenProps.model
      const topCard = speakCards[0]
      if (topCard === undefined) {
        return <Text>no cards</Text>
      } else {
        return <SpeakQuizScreen
          card={topCard}
          exposeLeaf={(leafId: number, remembered: boolean) => {
            args.screenProps.addExposure({
              exposureId: 0,
              leafId: leafId,
              remembered,
              createdAtSeconds: new Date().getTime() / 1000,
            })
          }} />
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
