import React, {Component} from 'react'
import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment'

class Blank extends Component {
  render() {
    return (
      <div>D3 is not displayed</div>
    )
  }
}

let NVD3Chart
if (ExecutionEnvironment.canUseDOM) {
  NVD3Chart = require('react-nvd3')
}

export default (ExecutionEnvironment.canUseDOM ? NVD3Chart : Blank)
