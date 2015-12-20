import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import Root from './client/containers/root'
import {configureStore} from './client/store'

import 'flat-ui/dist/js/flat-ui'
import 'jquery-lazyload'
// import 'datatables'

let initialState
try {
  initialState = window.__initialState
} catch (e) {
  initialState = {}
}
const store = configureStore(initialState)

ReactDOM.render(
  <Root store={store} />,
  document.querySelector('#app')
)
