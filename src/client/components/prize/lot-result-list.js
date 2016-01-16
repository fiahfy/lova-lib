import React, {Component, PropTypes} from 'react'

export default class LotResultList extends Component {
  static propTypes = {
    lotResults: PropTypes.arrayOf(PropTypes.object)
  };
  render() {
    const {lotResults} = this.props

    const lotResultsNodes = lotResults.map((result, index) => {
      return (
        <tr key={index}>
          <td>{index+1}</td>
          <td>{result.name}</td>
        </tr>
      )
    })

    return (
      <table className="table table-hover">
        <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
        </tr>
        </thead>
        <tbody>
          {lotResultsNodes}
        </tbody>
      </table>
    )
  }
}
