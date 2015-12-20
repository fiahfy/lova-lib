import {createHistory, createMemoryHistory, useQueries} from 'history'
import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment'

export default useQueries(
  ExecutionEnvironment.canUseDOM ? createHistory : createMemoryHistory
)()
