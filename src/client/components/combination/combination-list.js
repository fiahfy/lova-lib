import moment from 'moment'
import React, {Component, PropTypes} from 'react'
import {Link} from 'react-router'
import * as ServantUtils from '../../utils/servant-utils'

export default class CombinationList extends Component {
  static propTypes = {
    combinations: PropTypes.arrayOf(PropTypes.object),
    filter:       PropTypes.object
  };
  filteredCombinations() {
    const {combinations, filter} = this.props

    return _.filter(combinations, filter)
  }
  getCombinationsTable() {
    return this.refs.combinationsTable
  }
  shouldComponentUpdate(nextProps) {
    return JSON.stringify(this.props) != JSON.stringify(nextProps)
  }
  render() {
    const {combinations} = this.props

    let combination = _.maxBy(combinations, 'win_rate')
    const maxWinRate = combination ? combination.win_rate : 0
    combination = _.maxBy(combinations, 'usage_count')
    const maxUsageCount = combination ? combination.usage_count : 0

    const combinationNodes = this.filteredCombinations()
      // .sort(ServantUtils.compareServant)
      .map((combination, index) => {
        const style = {backgroundPositionX: `${-40*(combination.tribe_code-1)}px`}
        const winRateRatio = combination.win_rate / maxWinRate * 100
        const usageCountRatio = combination.usage_count / maxUsageCount * 100

        combination.tribe_id = 1

        return (
          <tr key={index} className={`tribe-${combination.tribe_id}`}>
            <th className="" scope="row">{combination.id}</th>
            <td className="clip">
              <div style={style} />
            </td>
            <td className="">
              <Link to={{pathname: '/combinations/', query: {tribe_id: combination.tribe_id}}}>
                {combination.tribe_name}
              </Link>
            </td>
            <td className="hidden-xs">
              <Link to={{pathname: '/combinations/', query: {q: `cost:${combination.cost}`}}}>
                {combination.cost}
              </Link>
            </td>
            <td className="hidden-xs hidden-sm">
              <Link to={`/combinations/${combination.id}/statistics/`}>
                <div>
                  {combination.win_rate.toFixed(2)}%
                </div>
                <div className="progress">
                  <div className="progress-bar" style={{width: `${winRateRatio}%`}} />
                </div>
              </Link>
            </td>
            <td className="hidden-xs hidden-sm">
              <Link to={`/combinations/${combination.id}/statistics/`}>
                <div>
                    {combination.usage_count}
                </div>
                <div className="progress">
                  <div className="progress-bar" style={{width: `${usageCountRatio}%`}} />
                </div>
              </Link>
            </td>
          </tr>
        )
      })

    return (
      <table className="table table-hover" ref="combinationsTable">
        <thead>
        <tr>
          <th className="">#</th>
          <th className="">Tribe</th>
          <th className="hidden-xs">Total Cost</th>
          <th className="">Servants</th>
          <th className="hidden-xs hidden-sm">Win Rate</th>
          <th className="hidden-xs hidden-sm">Usage Rate</th>
        </tr>
        </thead>
        <tbody>
          {combinationNodes}
        </tbody>
      </table>
    )
  }
}
