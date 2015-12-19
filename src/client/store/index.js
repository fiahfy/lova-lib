import {createStore, applyMiddleware, compose} from 'redux'
import {reduxReactRouter} from 'redux-router'
import {reduxReactRouter as serverReduxReactRouter} from 'redux-router/server'
import thunk from 'redux-thunk'
// import createLogger from 'redux-logger'
import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment'
import history from '../history'
import routes from '../routes'
import rootReducer from '../reducers'
import transitionMiddleware from '../middlewares/transition-middleware'
// import DevTools from '../containers/dev-tools'

const reduxReactRouterFunc = ExecutionEnvironment.canUseDOM
  ? reduxReactRouter({routes, history})
  : serverReduxReactRouter({routes, history})

const funcs = [
  applyMiddleware(thunk),
  reduxReactRouterFunc,
  applyMiddleware(transitionMiddleware),
  // applyMiddleware(createLogger()),
  // DevTools.instrument()
]

const finalCreateStore = compose(...funcs)(createStore)

export function configureStore(initialState) {
  const store = finalCreateStore(rootReducer, initialState)

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = rootReducer
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}
