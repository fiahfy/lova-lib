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
        const winRateRatio = combination.win_rate / maxWinRate * 100
        const usageCountRatio = combination.usage_count / maxUsageCount * 100
        const tribeIds = _.uniq(_.map(combination.servants, 'tribe_id'))
        const tribeId = tribeIds.length === 1 ? tribeIds[0] : 0

        return (
          <tr key={index}>
            <th className="" scope="row">{combination.id}</th>
            <td className="clip">
            {combination.servants.map((servant, index) => {
              return (
                <Link key={index} to={`/servants/${servant.id}/`} title={servant.name}>
                  <div className={`tribe-${servant.tribe_id}`}
                       style={{backgroundPositionX: `${-40*(servant.tribe_code-1)}px`}} />
                </Link>
              )
            })}
            </td>
            <td className="">
              {ServantUtils.getTribeName(tribeId) || '混種'}
            </td>
            <td className="hidden-xs">
              {combination.servants.reduce((previous, current) => {
                previous += current.cost
                return previous
              }, 0)}
            </td>
            <td className="hidden-xs hidden-sm">
              <div>
                <div>
                  {combination.win_rate.toFixed(2)}%
                </div>
                <div className="progress">
                  <div className="progress-bar" style={{width: `${winRateRatio}%`}} />
                </div>
              </div>
            </td>
            <td className="hidden-xs hidden-sm">
              <div>
                <div>
                    {_.padStart(combination.usage_count, 5, ' ')}
                </div>
                <div className="progress">
                  <div className="progress-bar" style={{width: `${usageCountRatio}%`}} />
                </div>
              </div>
            </td>
          </tr>
        )
      })

    return (
      <table className="table table-hover" ref="combinationsTable">
        <thead>
        <tr>
          <th className="">#</th>
          <th className="">Servants</th>
          <th className="">Tribe</th>
          <th className="hidden-xs">Total Cost</th>
          <th className="hidden-xs hidden-sm">Win Rate</th>
          <th className="hidden-xs hidden-sm">Usage Count</th>
        </tr>
        </thead>
        <tbody>
          {combinationNodes}
        </tbody>
      </table>
    )
  }
}
