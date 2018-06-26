import React from 'react'
import { Platform, Text } from 'react-native'
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation'

import SlowSpeakGameScreen from '../screens/SlowSpeakGameScreen'
import type { ScreenProps } from './ScreenProps'
import SettingsScreen from '../screens/SettingsScreen'
import SpeakSummaryScreen from '../screens/SpeakSummaryScreen'
import SpeakQuizScreen from '../screens/SpeakQuizScreen'
import TabBarIcon from '../components/TabBarIcon'

const SpeakStack = createStackNavigator({
  SpeakSummary: {
    screen: (args: { navigation: any, screenProps: ScreenProps }) =>
      <SpeakSummaryScreen
        bankModel={args.screenProps.bankModel}
        startSpeakQuiz={(stage: number) => {
          args.navigation.navigate('SpeakQuiz', { stage })
        }} />,
    navigationOptions: () => ({
      title: 'Speak in Spanish',
    }),
  },
  SpeakQuiz: {
    screen: (args: { navigation: any, screenProps: ScreenProps }) => {
      const { stage } = args.navigation.state.params
      const { bankModel, updateCards } = args.screenProps

      const leafIdsCsv = (bankModel.stageToLeafIdsCsvs[stage] || [])[0]
      if (leafIdsCsv === undefined) {
        return <Text>No card for stage {stage}</Text>
      } else {
        const card = bankModel.cardByLeafIdsCsv[leafIdsCsv]
        if (card.glossRows.length === 1) {
          return <SlowSpeakGameScreen
            card={card}
            updateCards={updateCards} />
        } else {
          return <SpeakQuizScreen
            bankModel={bankModel}
            card={card}
            updateCards={updateCards} />
        }
      }
    },
    navigationOptions: (args: {navigation: any, screenProps: ScreenProps}) => {
      const { stage } = args.navigation.state.params
      return { title: `Speak: ${stage}` }
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
    screen: (args: { navigation: any, screenProps: ScreenProps }) =>
      <SettingsScreen
        deleteDatabase={args.screenProps.deleteDatabase}
        downloadDatabase={args.screenProps.downloadDatabase}
        uploadDatabase={args.screenProps.uploadDatabase} />,
    navigationOptions: () => ({
      title: 'Settings',
    }),
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
  SpeakStack,
  SettingsStack,
})
