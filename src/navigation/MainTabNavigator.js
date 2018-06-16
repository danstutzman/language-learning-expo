import React from 'react'
import { Platform, Text } from 'react-native'
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation'

import { BLANK_LEAF } from '../model/Leaf'
import EditLeafScreen from '../screens/EditLeafScreen'
import EditLeafsScreen from '../screens/EditLeafsScreen'
import TabBarIcon from '../components/TabBarIcon'
import SlowSpeakGameScreen from '../screens/SlowSpeakGameScreen'
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
  SpeakSummary: {
    screen: (args: { navigation: any, screenProps: ScreenProps }) =>
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
    screen: (args: { navigation: any, screenProps: ScreenProps }) => {
      const { category } = args.navigation.state.params
      const { model, editLeaf, exposeLeafs } = args.screenProps

      const topCard = model.speakCardsByCategory[category][0]
      if (topCard === undefined) {
        return <Text>No cards in this category</Text>
      } else if (['UNTESTED', 'BROKEN', 'REMEMBERED_1X', 'REMEMBERED_2X'
        ].indexOf(category) !== -1) {
        if (topCard.leafs.length !== 1) {
          throw new Error(
            `Unexpected num leafs on topCard: ${JSON.stringify(topCard)}`)
        }
        const leaf = topCard.leafs[0]
        return <SlowSpeakGameScreen
          leaf={leaf}
          editMnemonic={(mnemonic: string) => editLeaf({ ...leaf, mnemonic })}
          exposeLeaf={(remembered: boolean) =>
            exposeLeafs([{ leafId: leaf.leafId, remembered }],
              new Date().getTime() / 1000)} />
      } else {
        return <SpeakQuizScreen card={topCard} exposeLeafs={exposeLeafs} />
      }
    },
    navigationOptions: (args: {navigation: any, screenProps: ScreenProps}) => {
      const { category } = args.navigation.state.params
      return { title: `Speak: ${category}` }
    },
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
  SettingsStack,
})
