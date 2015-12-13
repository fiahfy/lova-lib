import {createStore, applyMiddleware, compose} from 'redux'
import {reduxReactRouter} from 'redux-router'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import history from '../history'
import routes from '../routes'
import rootReducer from '../reducers'
import DevTools from '../containers/dev-tools'

const funcs = [
  applyMiddleware(thunk),
  reduxReactRouter({routes, history}),
  // applyMiddleware(createLogger()),
  // DevTools.instrument()
]

const finalCreateStore = compose(...funcs)(createStore)

export function configureStore(initialState) {
  const store = finalCreateStore(rootReducer, initialState)

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers')
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}
