import classNames from 'classnames'
import moment from 'moment'
import React, {Component, PropTypes} from 'react'
import NVD3Chart from 'react-nvd3'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as ActionCreators from '../actions'
import * as SpellUtils from '../utils/spell-utils'

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
  componentDidMount() {
    this.props.actions.fetchSpellStatistics({
      map:   'all',
      queue: 'all'
    });
  }
  render() {
    const {spellStatistics} = this.props

    const statistic = _.last(spellStatistics)
    const updated = statistic ? moment(statistic.date).format('YYYY-MM-DD') : ''

    return (
      <div className="container" id="charts">
        <div className="page-header">
          <h2>Charts</h2>
        </div>

        <h3>Spell Statistics
          <small>Updated {updated}</small>
        </h3>

        <NVD3Chart {...this.getSpellChartParams()} />
      </div>
    )
  }
}
