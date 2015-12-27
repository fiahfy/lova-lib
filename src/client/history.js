import {createHistory, createMemoryHistory, useQueries} from 'history'
import {useSimpleScroll} from 'scroll-behavior'
import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment'

export default useSimpleScroll(useQueries(
  ExecutionEnvironment.canUseDOM ? createHistory : createMemoryHistory
))()
