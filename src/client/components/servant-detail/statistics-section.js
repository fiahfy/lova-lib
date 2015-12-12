import React, {Component, PropTypes} from 'react'
import NVD3Chart from 'react-nvd3'

export default class StatisticsSection extends Component {
  static propTypes = {
    statistics: PropTypes.arrayOf(PropTypes.object)
  }
  state = {
    map:   'all',
    queue: 'all'
  }
  _getWinChartParams() {
    const {map, queue} = this.state
    const {statistics} = this.props

    let datum = []
    datum.push({
      key: 'Win Rate',
      area: true,
      color: '#1f77b4',
      values: _.filter(statistics, {mode: 'win', map, queue})
        .map(statistic => ({x: new Date(statistic.date), y: statistic.score}))
    })
    datum.push({
      key: 'All Servants Average',
      area: false,
      color: '#ff7f0e',
      values: _.filter(statistics, {mode: 'win', map, queue})
        .map(statistic => ({x: new Date(statistic.date), y: 50}))
    })

    return {
      type: 'lineChart',
      datum: datum,
      width: '100%',
      height: 350,
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
        axisLabel: 'Rate (%)',
        tickFormat: d => d3.format('.02f')(d),
        axisLabelDistance: -10
      }
    }
  }
  _getUsedChartParams() {
    const {map, queue} = this.state
    const {statistics} = this.props

    let datum = []
    datum.push({
      key: 'Used Rate',
      area: true,
      color: '#9467bd',
      values: _.filter(statistics, {mode: 'used', map, queue})
        .map(statistic => ({x: new Date(statistic.date), y: statistic.score}))
    })
    datum.push({
      key: 'All Servants Average',
      area: false,
      color: '#ff7f0e',
      values: _.filter(statistics, {mode: 'used', map, queue})
        .map(statistic => ({x: new Date(statistic.date), y: 100 / 230}))
    })

    return {
      type: 'lineChart',
      datum: datum,
      width: '100%',
      height: 350,
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
        axisLabel: 'Rate (%)',
        tickFormat: d => d3.format('.02f')(d),
        axisLabelDistance: -10
      }
    }
  }
  _handleOptionClick(e) {
    const options = _.reduce(this.refs, (previous, value, key) => {
      if (value.checked) {
        previous[value.name] = value.value
      }
      return previous
    }, {})
    this.setState(options)
  }
  componentDidMount() {
    // TODO: dont use jquery
    $('.statistics :radio').radiocheck()
  }
  render() {
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
                 onClick={this._handleOptionClick.bind(this)} />{option.name}
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
                 onClick={this._handleOptionClick.bind(this)} />{option.name}
        </label>
      )
    })

    return (
      <div className="statistics">
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

        <NVD3Chart {...this._getWinChartParams()} />
        <NVD3Chart {...this._getUsedChartParams()} />
      </div>
    )
  }
}
