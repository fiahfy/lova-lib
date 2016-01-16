import React, {Component, PropTypes} from 'react'
import {Provider} from 'react-redux'
import {ReduxRouter} from 'redux-router'
import DevTools from './dev-tools'
import config from '../../config'

export default class Root extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired
  };
  render() {
    const {store} = this.props
    const devTools = config.env === 'development' && config.devtools.monitor
      ? <DevTools /> : null

    return (
      <Provider store={store}>
        <div>
          <ReduxRouter />
          {devTools}
        </div>
      </Provider>
    )
  }
}
