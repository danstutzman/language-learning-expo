import React from 'react'
import { Platform, Text } from 'react-native'
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation'

import type { LeafCard } from '../cards/LeafCard'
import TabBarIcon from '../components/TabBarIcon'
import SlowSpeakGameScreen from '../screens/SlowSpeakGameScreen'
import type { ScreenProps } from './ScreenProps'
import SettingsScreen from '../screens/SettingsScreen'
import SpeakSummaryScreen from '../screens/SpeakSummaryScreen'
import SpeakQuizScreen from '../screens/SpeakQuizScreen'

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
      if (topSkill === undefined) {
        return <Text>No skills</Text>
      } else if (typeof (topSkill.card: any).getGlossRow !== 'undefined') {
        const leafCard: LeafCard = (topSkill.card: any)
        return <SlowSpeakGameScreen
          leafCard={leafCard}
          skill={topSkill}
          updateSkills={updateSkills} />
      } else {
        return <SpeakQuizScreen
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
        exportDatabase={args.screenProps.exportDatabase}
        reseedDatabase={args.screenProps.reseedDatabase} />,
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
