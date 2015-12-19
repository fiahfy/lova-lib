import classNames from 'classnames'
import moment from 'moment'
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as ActionCreators from '../actions'
import connectData from '../decorators/connect-data'

function fetchDataDeferred(getState, dispatch, location, params) {
  return ActionCreators.fetchServants()(dispatch)
}

function mapStateToProps(state) {
  return { servants: state.servants }
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(ActionCreators, dispatch) }
}

@connectData(null, fetchDataDeferred)
@connect(mapStateToProps, mapDispatchToProps)
export default class Servant extends Component {
  static propTypes = {
    servants: PropTypes.arrayOf(PropTypes.object),
    actions:  PropTypes.object
  }
  handleServantClick(servantId) {
    this.props.history.pushState(null, `/servants/${servantId}/`)
  }
  handleQuerySubmit(e) {
    e.preventDefault()
    const {query} = this.props.location
    query.q = this.refs.q.value
    this.props.history.pushState(null, '/servants/', query)
  }
  getServantFilter() {
    const {q, tribe_id} = this.props.location.query

    let i = 0
    let map = new Map()
    let filter = (q || '').replace(/"[^"]*"/g, (match) => {
      map.set(i, match.replace(/^"(.*)"$/, "$1"))
      return `@${i++}@`
    }).split(/[\s　]/i).map((element) => {
      return element.replace(/@(\d+)@/, (match, i) => {
        return map.get(+i)
      })
    }).reduce((p, c) => {
      const [key, value] = c.split(':')
      if (!value) {
        p['name'] = key
        return p
      }
      p[_.snakeCase(key)] = isNaN(value) ? value : +value
      return p
    }, {})

    if (tribe_id > 0) {
      filter['tribe_id'] = +tribe_id
    }

    return filter
  }
  filteredServants() {
    let {servants} = this.props

    const filter = this.getServantFilter()

    const name = filter.name
    delete filter.name

    servants = _.filter(servants, filter)
    if (name) {
      servants = _.filter(servants, servant => servant.name.indexOf(name) > -1)
    }
    return servants
  }
  componentDidUpdate() {
    // $('table.table').dataTable({
    //   paging: false,
    //   searching: false,
    //   columnDefs: [
    //     {orderable: false, targets: 1},
    //     {orderSequence: ['desc', 'asc'], targets: [6, 7, 8, 9]},
    //   ],
		//   bAutoWidth: false,
		//   bDestroy: true
    // })
  }
  componentDidMount() {
    // TODO: dont use jquery
    $('#servant').find('select').select2().on('select2-selecting', (e) => {
      const {query} = this.props.location
      query.tribe_id = e.val
      this.props.history.pushState(null, '/servants/', query)
    })
  }
  render() {
    const {tribeId, q} = this.props.location.query

    const tribeIdOptionNodes = [
      {value: 0, name: 'Select Tribe...'},
      {value: 1, name: '人獣'},
      {value: 2, name: '神族'},
      {value: 3, name: '魔種'},
      {value: 4, name: '海種'},
      {value: 5, name: '不死'}
    ].map((option, index) => {
      return (
        <option key={index} value={option.value}>
          {option.name}
        </option>
      )
    })

    const servantNodes = this.filteredServants()
      .sort((a, b) => (a.tribe_id * 1000 + a.tribe_code) - (b.tribe_id * 1000 + b.tribe_code))
      .map((servant, index) => {
        const cls = classNames('clip', `tribe-${servant.tribe_id}`)
        const style = {backgroundPositionX: `${-40*(servant.tribe_code-1)}px`}
        return (
          <tr key={index} onClick={this.handleServantClick.bind(this, servant.id)}>
            <th className="hidden-xs" scope="row">{servant.id}</th>
            <td className={cls} style={style}>　</td>
            <td className="">{`${servant.tribe_name}-${_.padLeft(servant.tribe_code, 3, 0)}`}</td>
            <td className="">{servant.cost}</td>
            <td className="hidden-xs">{servant.type}</td>
            <td className="">{servant.name}</td>
            <td className="hidden-xs hidden-sm">{servant.win_rate.toFixed(2)}</td>
            <td className="hidden-xs hidden-sm">{servant.used_rate.toFixed(2)}</td>
            <td className="hidden-xs hidden-sm">{moment(servant.release_date).format('YYYY-MM-DD')}</td>
            <td className="hidden-xs hidden-sm">{moment(servant.update_date).format('YYYY-MM-DD')}</td>
          </tr>
        )
      })

    return (
      <div className="container" id="servant">
        <div className="page-header">
          <h2>Servants</h2>
        </div>

        <div className="clearfix">
          <div className="pull-left">
            <select className="form-control select select-primary select-block mbl"
                    defaultValue={tribeId}>
              {tribeIdOptionNodes}
            </select>
          </div>
        </div>

        <div className="form-group">
          <form onSubmit={this.handleQuerySubmit.bind(this)}>
            <input type="text" placeholder="Input Keyword..." className="form-control"
                   ref="q" defaultValue={q} />
          </form>
        </div>

        <div>
          <table className="table table-hover">
            <thead>
            <tr>
              <th className="hidden-xs">#</th>
              <th className="" />
              <th className="">Tribe</th>
              <th className="">Cost</th>
              <th className="hidden-xs">Type</th>
              <th className="">Servant Name</th>
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
        </div>
      </div>
    )
  }
}
