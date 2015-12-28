import React, {Component} from 'react'
import config from '../../config'

class Blank extends Component {
  render() {
    return (
      <div>D3 is not displayed</div>
    )
  }
}

export default (config.target === 'client' ? require('react-nvd3') : Blank)
