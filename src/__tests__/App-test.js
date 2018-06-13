import React from 'react'
import 'react-native'
import renderer from 'react-test-renderer'
import 'stacktrace-parser' // Fixes TypeError: TaskQueue: Error with task : Cannot read property 'Object.<anonymous>' of null

import App from '../../App'

it('renders the loading screen', async () => {
  const tree = renderer.create(<App skipLoadingScreen={false} />).toJSON()
  expect(tree).toMatchSnapshot()
})

it('renders the root without loading screen', async () => {
  const tree = renderer.create(<App skipLoadingScreen={true} />).toJSON()
  expect(tree).toMatchSnapshot()
})
