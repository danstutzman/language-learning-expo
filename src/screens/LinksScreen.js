import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { ExpoLinksView } from '@expo/samples'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
})

export default class LinksScreen extends React.PureComponent<{}> {
  render() {
    // Go ahead and delete ExpoLinksView and replace it with your
    // content, we just wanted to provide you with some helpful links
    return <ScrollView style={styles.container}>
      <ExpoLinksView />
    </ScrollView>
  }
}