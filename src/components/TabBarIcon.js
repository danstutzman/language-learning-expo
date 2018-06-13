import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import Colors from '../constants/Colors'

type Props = {
  focused: boolean,
  name: string,
}

export default class TabBarIcon extends React.PureComponent<Props> {
  render() {
    return (
      <Ionicons
        name={this.props.name}
        size={26}
        style={{ marginBottom: -3 }}
        color={this.props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
      />
    )
  }
}