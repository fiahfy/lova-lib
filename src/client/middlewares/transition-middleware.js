import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment'
import {ROUTER_DID_CHANGE} from 'redux-router/lib/constants'

const locationsAreEqual = (locA, locB) => (locA.pathname === locB.pathname) && (locA.search === locB.search)

/**
 * @see https://github.com/erikras/react-redux-universal-hot-example/blob/master/src/helpers/getDataDependencies.js
 */
function getDataDependencies(components, getState, dispatch, location, params, deferred) {
  const methodName = deferred ? 'fetchDataDeferred' : 'fetchData'

  return components
    .filter(component => component && component[methodName])
    .map(component => component[methodName])
    .map(fetchData =>
      fetchData(getState, dispatch, location, params))
}

/**
 * @see https://github.com/erikras/react-redux-universal-hot-example/blob/master/src/redux/middleware/transitionMiddleware.js
 */
export default function transitionMiddleware({getState, dispatch}) {
  return next => action => {
    if (action.type === ROUTER_DID_CHANGE) {
      if (getState().router && locationsAreEqual(action.payload.location, getState().router.location)) {
        return next(action)
      }

      const {components, location, params} = action.payload
      const promise = new Promise((resolve) => {
        const doTransition = () => {
          next(action)
          Promise.all(getDataDependencies(components, getState, dispatch, location, params, true))
            .then(resolve)
            .catch(() => resolve())
        }

        Promise.all(getDataDependencies(components, getState, dispatch, location, params))
          .then(doTransition)
          .catch(() => doTransition())
      })

      if (!ExecutionEnvironment.canUseDOM) {
        // router state is null until ReduxRouter is created so we can use this to store
        // our promise to let the server know when it can render
        getState().router = promise
      }

      return promise
    }

    return next(action)
  }
}
