import classNames from 'classnames'
import moment from 'moment'
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as ActionCreators from '../actions'
import connectData from '../decorators/connect-data'
import * as PrizeUtils from '../utils/prize-utils'
import PrizeList from '../components/prize/prize-list'
import LotResultList from '../components/prize/lot-result-list'
import LotResultSummaryList from '../components/prize/lot-result-summary-list'

function fetchDataDeferred(getState, dispatch) {
  return ActionCreators.fetchPrizes()(dispatch)
}

function mapStateToProps(state) {
  return {prizes: state.prizes}
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(ActionCreators, dispatch)}
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

    const {results, resultsSummary} = PrizeUtils.drawPrizes(prizes, times)

    this.setState({
      lotResults: results,
      lotResultsSummary: resultsSummary
    })
  }
  getUpdateDate() {
    const {prizes} = this.props

    const prize = _.first(prizes)

    return prize ? prize.date : ''
  }
  render() {
    const {prizes} = this.props
    const {view, lotResults, lotResultsSummary} = this.state

    const viewOptionNodes = [
      {value: 0, iconClassName: 'fui-list-numbered'},
      {value: 1, iconClassName: 'fui-list-thumbnailed'}
    ].map((option, index) => {
      const isActive = option.value === view
      const cls = classNames('btn', 'btn-primary', {active: isActive})
      return (
        <a key={index} className={cls}
           onClick={this.handleViewClick.bind(this, option.value)}>
          <span className={option.iconClassName} />
        </a>
      )
    })

    const updated = this.getUpdateDate()

    const lotResultNodes = view === 0
                         ? <LotResultList lotResults={lotResults} />
                         : <LotResultSummaryList lotResultsSummary={lotResultsSummary} />

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
              <input type="text" className="form-control" min="1" max="1000"
                     ref="times" defaultValue="10" placeholder="1-1000" />
              <span className="input-group-btn">
                <button className="btn btn-primary"
                        onClick={::this.handleDrawClick}>Draw</button>
              </span>
            </div>

            <div className="btn-toolbar pull-right">
              <div className="btn-group">
                {viewOptionNodes}
              </div>
            </div>

            {lotResultNodes}
          </div>

          <div className="col-sm-6">
            <div className="clearfix">
              <h3>Prize List
                <small>Updated {moment(updated).format('YYYY-MM-DD')}</small>
                <small className="pull-right">
                  <a href="http://lova.jp/prizelist/">Official Prize List Page</a>
                </small>
              </h3>
            </div>

            <PrizeList prizes={prizes} />
          </div>
        </div>
      </div>
    )
  }
}
