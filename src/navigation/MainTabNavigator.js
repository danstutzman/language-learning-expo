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
        startSpeakQuiz={(cardId: number) => {
          args.navigation.navigate('SpeakQuiz', { cardId })
        }} />,
    navigationOptions: () => ({
      title: 'Speak in Spanish',
    }),
  },
  SpeakQuiz: {
    screen: (args: { navigation: any, screenProps: ScreenProps }) => {
      const { cardId } = args.navigation.state.params
      const { bankModel, updateSkills } = args.screenProps

      const topSkill = bankModel.skillByCardId[cardId]
      const topCard = bankModel.cardByCardId[cardId]
      if (topSkill === undefined || topCard === undefined) {
        return <Text>No skill or card for cardId {cardId}</Text>
      } else if (topCard.glossRows.length === 1) {
        return <SlowSpeakGameScreen
          card={topCard}
          skill={topSkill}
          updateSkills={updateSkills} />
      } else {
        return <SpeakQuizScreen
          bankModel={bankModel}
          card={topCard}
          skill={topSkill}
          updateSkills={updateSkills} />
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
    screen: (args: { navigation: any, screenProps: ScreenProps }) =>
      <SettingsScreen
        deleteDatabase={args.screenProps.deleteDatabase}
        downloadDatabase={args.screenProps.downloadDatabase} />,
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
