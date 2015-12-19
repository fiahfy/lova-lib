import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment'

let NVD3Chart = null
if (ExecutionEnvironment.canUseDOM) {
  NVD3Chart = require('react-nvd3')
}

export default NVD3Chart
