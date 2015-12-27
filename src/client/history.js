import {createHistory, createMemoryHistory, useQueries} from 'history'
import {useSimpleScroll} from 'scroll-behavior'
import config from '../config'

export default useSimpleScroll(useQueries(
  config.target === 'client' ? createHistory : createMemoryHistory
))()
