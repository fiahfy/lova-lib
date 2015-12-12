import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import Root from './containers/root'
import {configureStore} from './store'

import 'flat-ui/dist/js/flat-ui'
import 'jquery-lazyload'
import 'datatables'

const store = configureStore()

ReactDOM.render(
  <Root store={store} />,
  document.querySelector('#app')
)
