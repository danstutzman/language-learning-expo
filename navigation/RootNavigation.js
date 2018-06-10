import { Notifications } from 'expo'
import React from 'react'
import { createSwitchNavigator } from 'react-navigation'

import MainTabNavigator from './MainTabNavigator'
import registerForPushNotificationsAsync from '../api/registerForPushNotificationsAsync'
import type { Item } from '../types/Item'

const AppNavigator = createSwitchNavigator({
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html
  Main: MainTabNavigator,
})

type Props = {
  items: Array<Item>,  
}

export default class RootNavigation extends React.PureComponent<Props> {
  _notificationSubscription: any

  componentDidMount() {
    this._notificationSubscription = this._registerForPushNotifications()
  }

  componentWillUnmount() {
    this._notificationSubscription && this._notificationSubscription.remove()
  }

  render() {
    return <AppNavigator screenProps={this.props} />
  }

  _registerForPushNotifications() {
    // Send our push token over to our backend so we can receive notifications
    // You can comment the following line out if you want to stop receiving
    // a notification every time you open the app. Check out the source
    // for this function in api/registerForPushNotificationsAsync.js
    registerForPushNotificationsAsync()

    // Watch for incoming notifications
    this._notificationSubscription = Notifications.addListener(this._handleNotification)
  }

  _handleNotification = (args: { origin: string, data: any }) => {
    console.log(`Push notification ${args.origin} with data: ${JSON.stringify(args.data)}`)
  }
}
