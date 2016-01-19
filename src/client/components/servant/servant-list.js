import moment from 'moment'
import React, {Component, PropTypes} from 'react'
import {Link} from 'react-router'
import * as ServantUtils from '../../utils/servant-utils'

export default class ServantList extends Component {
  static propTypes = {
    servants: PropTypes.arrayOf(PropTypes.object),
    filter:   PropTypes.object
  };
  filteredServants() {
    const {servants, filter} = this.props

    const newFilter = _.clone(filter)
    const name = newFilter.name
    delete newFilter.name

    let results = _.filter(servants, newFilter)
    if (name) {
      results = _.filter(results, servant => servant.name.indexOf(name) > -1)
    }
    return results
  }
  getServantsTable() {
    return this.refs.servantsTable
  }
  shouldComponentUpdate(nextProps) {
    return JSON.stringify(this.props) != JSON.stringify(nextProps)
  }
  render() {
    const servantNodes = this.filteredServants()
      .sort(ServantUtils.compareServant)
      .map((servant, index) => {
        const style = {backgroundPositionX: `${-40*(servant.tribe_code-1)}px`}
        return (
          <tr key={index} className={`tribe-${servant.tribe_id}`}>
            <th className="" scope="row">{servant.id}</th>
            <td className="clip">
              <div style={style} />
            </td>
            <td className="">
              <Link to="/servants/" query={{tribe_id: servant.tribe_id}}>{servant.tribe_name}</Link>
              {`-${_.padLeft(servant.tribe_code, 3, 0)}`}
            </td>
            <td className="hidden-xs">
              <Link to="/servants/" query={{q: `cost:${servant.cost}`}}>{servant.cost}</Link>
            </td>
            <td className="hidden-xs">
              <Link to="/servants/" query={{q: `type:${servant.type}`}}>{servant.type}</Link>
            </td>
            <td className="">
              <Link to={`/servants/${servant.id}/`}>{servant.name}</Link>
            </td>
            <td className="hidden-xs hidden-sm">
              <Link to={`/servants/${servant.id}/statistics/`}>{servant.win_rate.toFixed(2)}</Link>
            </td>
            <td className="hidden-xs hidden-sm">
              <Link to={`/servants/${servant.id}/statistics/`}>{servant.used_rate.toFixed(2)}</Link>
            </td>
            <td className="hidden-xs hidden-sm">{moment(servant.release_date).format('YYYY-MM-DD')}</td>
            <td className="hidden-xs hidden-sm">{moment(servant.update_date).format('YYYY-MM-DD')}</td>
          </tr>
        )
      })

    return (
      <table className="table table-hover" ref="servantsTable">
        <thead>
        <tr>
          <th className="">#</th>
          <th className="" />
          <th className="">Tribe</th>
          <th className="hidden-xs">Cost</th>
          <th className="hidden-xs">Type</th>
          <th className="">Servant</th>
          <th className="hidden-xs hidden-sm">Win Rate</th>
          <th className="hidden-xs hidden-sm">Used Rate</th>
          <th className="hidden-xs hidden-sm">Released</th>
          <th className="hidden-xs hidden-sm">Updated</th>
        </tr>
        </thead>
        <tbody>
          {servantNodes}
        </tbody>
      </table>
    )
  }
}
