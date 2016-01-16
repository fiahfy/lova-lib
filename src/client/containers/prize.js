import classNames from 'classnames'
import moment from 'moment'
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as ActionCreators from '../actions'
import connectData from '../decorators/connect-data'

function fetchDataDeferred(getState, dispatch) {
  return ActionCreators.fetchPrizes()(dispatch)
}
function mapStateToProps(state) {
  return { prizes: state.prizes }
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(ActionCreators, dispatch) }
}

@connectData(null, fetchDataDeferred)
@connect(mapStateToProps, mapDispatchToProps)
export default class Prize extends Component {
  static propTypes = {
    prizes:  PropTypes.arrayOf(PropTypes.object),
    actions: PropTypes.object
  };
  state = {
    view:              0,
    lotResults:        [],
    lotResultsSummary: []
  };
  handleViewClick(view) {
    this.setState({view: view})
  }
  handleDrawClick() {
    let times = this.refs.times.value
    times = Math.min(Math.max(1, times), 1000)
    this.refs.times.value = times

    const {prizes} = this.props

    let totalRate = 0
    const lots = prizes.map((e) => {
      totalRate += e.rate
      return {rate: totalRate, prize: e}
    })

    let results = []
    for (let i = 0; i < times; i++) {
      const rate = Math.random() * totalRate
      for (let j = 0; j < lots.length; j++) {
        const lot = lots[j]
        if (rate <= lot.rate) {
          results.push(lot.prize)
          break
        }
      }
    }

    const summary = results.reduce((p, c) => {
      if (!p[c.id]) {
        p[c.id] = {prize: c, count: 0, rate: 0}
      }
      p[c.id].count++
      p[c.id].rate = p[c.id].count / times
      return p
    }, {})
    const resultsSummary = _.map(summary, (value) => {
      return {
        prize: value.prize,
        count: value.count,
        rate: value.rate
      }
    }).sort((a, b) => {
      return b.count - a.count
    })

    this.setState({
      lotResults: results,
      lotResultsSummary: resultsSummary
    })
  }
  render() {
    const {prizes} = this.props
    const {view, lotResults, lotResultsSummary} = this.state

    const viewOptionNodes = [
      {value: 0, iconClassName: 'fui-list-numbered'},
      {value: 1, iconClassName: 'fui-list-thumbnailed'}
    ].map((option) => {
      const cls = classNames('btn', 'btn-primary', {active: option.value === view})
      return (
        <a key={`view-${option.value}`} className={cls} onClick={this.handleViewClick.bind(this, option.value)}>
          <span className={option.iconClassName} />
        </a>
      )
    })

    const prize = _.first(prizes)
    const updated = prize ? moment(prize.date).format('YYYY-MM-DD') : ''

    const prizeNodes = prizes.map((prize, index) => {
      return (
        <tr key={index}>
          <td className="">{prize.name}</td>
          <td className="">{prize.rate.toFixed(3)}</td>
        </tr>
      )
    })

    const lotResultsNodes = lotResults.map((result, index) => {
      return (
        <tr key={index}>
          <td className="">{index+1}</td>
          <td className="">{result.name}</td>
        </tr>
      )
    })

    const lotResultsSummaryNodes = lotResultsSummary.map((result, index) => {
      return (
        <tr key={index}>
          <td className="">{result.prize.name}</td>
          <td className="">{result.count}</td>
          <td className="">{result.rate.toFixed(3)}</td>
        </tr>
      )
    })

    let lotNodes
    if (view === 0) {
      lotNodes = (
        <table className="table table-hover">
          <thead>
          <tr>
            <th className="">#</th>
            <th className="">Name</th>
          </tr>
          </thead>
          <tbody>
          {lotResultsNodes}
          </tbody>
        </table>
      )
    } else {
      lotNodes = (
        <table className="table table-hover">
          <thead>
          <tr>
            <th className="">Name</th>
            <th className="">Count</th>
            <th className="">Rate</th>
          </tr>
          </thead>
          <tbody>
          {lotResultsSummaryNodes}
          </tbody>
        </table>
      )
    }

    return (
      <div className="container" id="prize">
        <div className="page-header">
          <h2>Prize</h2>
        </div>

        <div className="row">
          <div className="col-sm-6">
            <div className="clearfix">
              <h3>Draw Lots</h3>
            </div>

            <div className="input-group pull-left">
              <input type="text" className="form-control" min="1" max="1000" placeholder="1-1000"
                     ref="times" defaultValue="10" />
              <span className="input-group-btn">
                <button className="btn btn-primary" onClick={this.handleDrawClick.bind(this)}>Draw</button>
              </span>
            </div>

            <div className="btn-toolbar pull-right">
              <div className="btn-group">
                {viewOptionNodes}
              </div>
            </div>

            {lotNodes}
          </div>

          <div className="col-sm-6">
            <div className="clearfix">
              <h3>Prize List
                <small>Updated {updated}</small>
                <small className="pull-right">
                  <a href="http://lova.jp/prizelist/">Official Prize List Page</a>
                </small>
              </h3>
            </div>

            <table className="table table-hover">
              <thead>
              <tr>
                <th className="">Name</th>
                <th className="">Rate</th>
              </tr>
              </thead>
              <tbody>
                {prizeNodes}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
}
