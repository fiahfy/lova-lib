import React, {Component} from 'react';
import classNames from 'classnames';
import NVD3Chart from 'react-nvd3';
import SpellStatisticAction from '../actions/spell-statistic';
import SpellStatisticStore from '../stores/spell-statistic';
import SpellStore from '../stores/spell';

export default class Chart extends Component {
  state = {
    spellStatistics: []
  };
  constructor() {
    super();
    this._onChange = this._onChange.bind(this);
  }
  _getSpellChart() {
    const datum = _.uniq(_.pluck(this.state.spellStatistics, 'spell_id')).sort((a, b) => {
      return a - b;
    }).map((spell_id) => {
      return {
        key: SpellStore.getSpellName(spell_id),
        values: _.filter(this.state.spellStatistics, {spell_id: spell_id}).map((statistic) => {
          return {x: new Date(statistic.date), y: statistic.score};
        })
      }
    });

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
        tickFormat: (d) => {
          return d3.time.format('%Y-%m-%d')(new Date(d));
        }
      },
      yAxis: {
        axisLabel: 'Used Rate (%)',
        tickFormat: function(d){
          return d3.format('.02f')(d);
        },
        axisLabelDistance: -10
      }
    };
  }
  _onChange() {
    this.setState({
      spellStatistics: SpellStatisticStore.getSpellStatistics({
        map: 'all',
        queue: 'all'
      })
    });
  }
  componentDidMount() {
    SpellStatisticStore.addChangeListener(this._onChange);
    SpellStatisticAction.fetchSpellStatistics({
      map: 'all',
      queue: 'all'
    });
  }
  componentWillUnmount() {
    SpellStatisticStore.removeChangeListener(this._onChange);
  }
  render() {
    const statistic = _.last(this.state.spellStatistics);
    const updated = statistic ? new Intl.DateTimeFormat().format(new Date(statistic.date)) : '';

    const spellChart = this._getSpellChart();

    return (
      <div className="container" id="charts">
        <div className="page-header">
          <h2>Charts</h2>
        </div>

        <h3>Spell Statistics
          <small>Updated {updated}</small>
        </h3>

        <NVD3Chart {...spellChart} />
      </div>
    );
  }
}
