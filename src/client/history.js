import {browserHistory, createMemoryHistory} from 'react-router'
import {useSimpleScroll} from 'scroll-behavior'
import config from '../config'

function createBrowserHistory() {
  return useSimpleScroll(() => browserHistory)()
}

export default (config.target === 'client' ? createBrowserHistory() : createMemoryHistory())
