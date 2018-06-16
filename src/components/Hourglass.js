import React from 'react'
import { FontAwesome } from '@expo/vector-icons'

const SECONDS_LEFT_TO_ICON = {
  '3': 'hourglass-start',
  '2': 'hourglass-half',
  '1': 'hourglass-end',
}

type Props = {|
  secondsLeft: number,
|}

export default class Hourglass extends React.PureComponent<Props> {
  render() {
    return <FontAwesome
      name={SECONDS_LEFT_TO_ICON[this.props.secondsLeft]}
      size={26}
      color="#ddd" />
  }
}
