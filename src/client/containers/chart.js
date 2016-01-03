import moment from 'moment'
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as ActionCreators from '../actions'
import * as SpellUtils from '../utils/spell-utils'
import connectData from '../decorators/connect-data'
import NVD3Chart from '../components/react-nvd3'

function fetchDataDeferred(getState, dispatch) {
  return Promise.all([
    ActionCreators.fetchSpellStatistics({
      map:   'all',
      queue: 'all'
    })(dispatch)
  ])
}

function mapStateToProps(state) {
  return {
    spellStatistics: _.filter(state.spellStatistics, {
      map:   'all',
      queue: 'all'
    })
  }
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(ActionCreators, dispatch) }
}

@connectData(null, fetchDataDeferred)
@connect(mapStateToProps, mapDispatchToProps)
export default class Chart extends Component {
  static propTypes = {
    spellStatistics:  PropTypes.arrayOf(PropTypes.object),
    actions:          PropTypes.object
  }
  getSpellChartParams() {
    const {spellStatistics} = this.props

    const datum = _.uniq(_.pluck(spellStatistics, 'spell_id'))
      .sort((a, b) => a - b)
      .map((spell_id) => {
        return {
          key:    SpellUtils.getSpellName(spell_id),
          values: _.filter(spellStatistics, {spell_id: spell_id})
            .map(statistic => ({x: new Date(statistic.date), y: statistic.score}))
        }
      })

    return {
      type: 'lineChart',
      datum: datum,
      width: '100%',
      height: 500,
      margin : {
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
        axisLabel: 'Used Rate (%)',
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
    this.setState(options)
  }
  componentDidMount() {
    $(':radio').radiocheck()
  }
  render() {
    const {spellStatistics} = this.props

    const statistic = _.last(spellStatistics)
    const updated = statistic ? moment(statistic.date).format('YYYY-MM-DD') : ''

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
                 onClick={this.handleOptionClick.bind(this)} />{option.name}
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
                 onClick={this.handleOptionClick.bind(this)} />{option.name}
        </label>
      )
    })

    return (
      <div className="container" id="charts">
        <div className="page-header">
          <h2>Charts</h2>
        </div>

        <h3>Spell Statistics
          <small>Updated {updated}</small>
        </h3>

        <form className="form-horizontal">
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
