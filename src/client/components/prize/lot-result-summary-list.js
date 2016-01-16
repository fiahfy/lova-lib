import React, {Component, PropTypes} from 'react'

export default class LotResultSummaryList extends Component {
  static propTypes = {
    lotResultsSummary: PropTypes.arrayOf(PropTypes.object)
  };
  render() {
    const {lotResultsSummary} = this.props

    const lotResultsSummaryNodes = lotResultsSummary.map((result, index) => {
      return (
        <tr key={index}>
          <td>{result.prize.name}</td>
          <td>{result.count}</td>
          <td>{result.rate.toFixed(3)}</td>
        </tr>
      )
    })

    return (
      <table className="table table-hover">
        <thead>
        <tr>
          <th>Name</th>
          <th>Count</th>
          <th>Rate</th>
        </tr>
        </thead>
        <tbody>
          {lotResultsSummaryNodes}
        </tbody>
      </table>
    )
  }
}
