import moment from 'moment'
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {asyncConnect} from 'redux-async-connect'
import * as ActionCreators from '../actions'
import * as SpellUtils from '../utils/spell-utils'
import NVD3Chart from '../components/common/react-nvd3'

function mapStateToProps(state) {
  return {spellStatistics: state.spellStatistics}
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(ActionCreators, dispatch)}
}

@asyncConnect([{
  deferred: true,
  promise: ({store: {dispatch}}) => {
    return Promise.all([
      ActionCreators.fetchSpellStatistics({
        period: 'daily',
        map:    'all',
        queue:  'all'
      })(dispatch)
    ])
  }
}])
@connect(mapStateToProps, mapDispatchToProps)
export default class Chart extends Component {
  static propTypes = {
    spellStatistics:  PropTypes.arrayOf(PropTypes.object),
    actions:          PropTypes.object
  };
  state = {
    period: 'daily',
    map:    'all',
    queue:  'all'
  };
  getSpellChartParams() {
    const {spellStatistics} = this.props

    const datum = _.uniq(_.map(spellStatistics, 'spell_id'))
      .sort((a, b) => a - b)
      .map((spell_id) => {
        return {
          key:    SpellUtils.getSpellName(spell_id),
          values: _.filter(spellStatistics, {spell_id, ...this.state})
            .map(statistic => ({x: new Date(statistic.date), y: statistic.score}))
        }
      })

    return {
      type: 'lineChart',
      datum: datum,
      height: 500,
      margin: {
        top: 20,
        right: 30,
        bottom: 50,
        left: 50
      },
      transitionDuration: 500,
      interpolate: 'monotone',
      useInteractiveGuideline: true,
      xAxis: {
        tickFormat: d => d3.time.format('%Y-%m-%d')(new Date(d))
      },
      yAxis: {
        axisLabel: 'Usage Rate (%)',
        tickFormat: d => d3.format('.02f')(d),
        axisLabelDistance: -10
      }
    }
  }
  handleOptionClick() {
    const options = _.reduce(this.refs, (previous, value) => {
      if (value.checked) {
        previous[value.name] = value.value
      }
      return previous
    }, {})
    this.props.actions.fetchSpellStatistics(options)
    this.setState(options)
  }
  componentDidMount() {
    $(':radio').radiocheck()
  }
  render() {
    const {spellStatistics} = this.props

    const statistic = _.last(spellStatistics)
    const updated = statistic ? moment(statistic.date).format('YYYY-MM-DD') : ''

    const periodOptionNodes = [
      {value: 'daily',  name: 'Daily'},
      {value: 'weekly', name: 'Weekly'}
    ].map((option, index) => {
      const active = option.value === 'daily'
      return (
        <label key={index} className="radio radio-inline">
          <input ref={`period-${option.value}`} type="radio" name="period"
                 value={option.value} defaultChecked={active}
                 onClick={::this.handleOptionClick} />{option.name}
        </label>
      )
    })

    const mapOptionNodes = [
      {value: 'all',       name: 'All'},
      {value: 'vermilion', name: 'Vermilion'},
      {value: 'braze',     name: 'Braze'}
    ].map((option, index) => {
      const active = option.value === 'all'
      return (
        <label key={index} className="radio radio-inline">
          <input ref={`map-${option.value}`} type="radio" name="map"
                 value={option.value} defaultChecked={active}
                 onClick={::this.handleOptionClick} />{option.name}
        </label>
      )
    })

    const queueOptionNodes = [
      {value: 'all',    name: 'All'},
      {value: 'normal', name: 'Normal'},
      {value: 'solo',   name: 'Solo'}
    ].map((option, index) => {
      const active = option.value === 'all'
      return (
        <label key={index} className="radio radio-inline">
          <input ref={`queue-${option.value}`} type="radio" name="queue"
                 value={option.value} defaultChecked={active}
                 onClick={::this.handleOptionClick} />{option.name}
        </label>
      )
    })

    return (
      <div className="container" id="chart">
        <div className="page-header">
          <h2>Charts</h2>
        </div>

        <h3>Spell Statistics
          <small>Updated {updated}</small>
        </h3>

        <form className="form-horizontal">
          <div className="form-group">
            <label className="control-label col-xs-12 col-sm-2">Period</label>
            <div className="col-xs-12 col-sm-10 text-left">
              {periodOptionNodes}
            </div>
          </div>
          <div className="form-group">
            <label className="control-label col-xs-12 col-sm-2">Map</label>
            <div className="col-xs-12 col-sm-10 text-left">
              {mapOptionNodes}
            </div>
          </div>
          <div className="form-group">
            <label className="control-label col-xs-12 col-sm-2">Queue</label>
            <div className="col-xs-12 col-sm-10 text-left">
              {queueOptionNodes}
            </div>
          </div>
        </form>

        <NVD3Chart {...this.getSpellChartParams()} />
      </div>
    )
  }
}
