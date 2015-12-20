import React, {Component, PropTypes} from 'react'

export default class StatusItem extends Component {
  static propTypes = {
    rows:  PropTypes.number,
    level: PropTypes.number,
    hp:    PropTypes.number,
    ap:    PropTypes.number,
    atk:   PropTypes.number,
    pow:   PropTypes.number,
    def:   PropTypes.number,
    res:   PropTypes.number,
    ms:    PropTypes.number,
    as:    PropTypes.number
  }
  render() {
    const {rows, level,
      hp, ap, atk, pow, def, res, ms, as} = this.props

    if (rows === 1) {
      return (
        <tbody>
        <tr>
          <td className="">{level}</td>
          <td className="">{hp}</td>
          <td className="">{ap}</td>
          <td className="">{atk}</td>
          <td className="">{pow}</td>
          <td className="">{def}</td>
          <td className="">{res}</td>
          <td className="">{ms}</td>
          <td className="">{as.toFixed(2)}</td>
        </tr>
        </tbody>
      )
    }
    
    return (
      <tbody>
      <tr>
        <td rowSpan="2">{level}</td>
        <td className="">{hp}</td>
        <td className="">{atk}</td>
        <td className="">{def}</td>
        <td className="">{ms}</td>
      </tr>
      <tr>
        <td className="">{ap}</td>
        <td className="">{pow}</td>
        <td className="">{res}</td>
        <td className="">{as.toFixed(2)}</td>
      </tr>
      </tbody>
    )
  }
}
