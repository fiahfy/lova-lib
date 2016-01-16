import React, {Component, PropTypes} from 'react'

export default class PrizeList extends Component {
  static propTypes = {
    prizes: PropTypes.arrayOf(PropTypes.object)
  };
  render() {
    const {prizes} = this.props

    const prizeNodes = prizes.map((prize, index) => {
      return (
        <tr key={index}>
          <td className="">{prize.name}</td>
          <td className="">{prize.rate.toFixed(3)}</td>
        </tr>
      )
    })

    return (
      <table className="table table-hover">
        <thead>
        <tr>
          <th>Name</th>
          <th>Rate</th>
        </tr>
        </thead>
        <tbody>
          {prizeNodes}
        </tbody>
      </table>
    )
  }
}
