import React, {Component} from 'react';
import {Link} from 'react-router'
import classNames from 'classnames';
import NVD3Chart from 'react-nvd3';
import ServantAction from '../actions/servant';
import ServantStatisticAction from '../actions/servant-statistic';
import ServantStore from '../stores/servant';
import ServantStatisticStore from '../stores/servant-statistic';

export default class ServantDetail extends Component {
  state = {
    servant: null
  };
  constructor() {
    super();
    this._onChange = this._onChange.bind(this);
  }
  _onChange() {
    this.setState({
      servant: ServantStore.getServant(+this.props.params.id)
    });
  }
  componentDidMount() {
    ServantStore.addChangeListener(this._onChange);
    ServantAction.fetchServant(+this.props.params.id);
  }
  componentWillUnmount() {
    ServantStore.removeChangeListener(this._onChange);
  }
  render() {
    const {query, hash} = this.props.location;

    const servant = this.state.servant || {};

    const navigationNodes = ['detail', 'statistics'].map((navigation, index) => {
      const cls = classNames({active: (hash || '#detail') === `#${navigation}`});
      return (
        <li key={index} role="presentation" className={cls}>
          <Link to={`/servants/${servant.id}/`} hash={`#${navigation}`}>{_.capitalize(navigation)}</Link>
        </li>
      );
    });

    const section = hash !== '#statistics'
      ? (<DetailSection servant={servant} />)
      : (<StatisticsSection servant={servant} />);

    return (
      <div className="container" id="servant-detail">
        <div className="page-header">
          <h2>{servant.name}
            <small className="pull-right">
              <a href={`http://wiki.4gamer.net/lova/使い魔/${servant.tribe_name}/${servant.name}/`}>
                to Official Servant Page
              </a>
            </small>
          </h2>
        </div>

        <ul className="nav nav-pills nav-justified">
          {navigationNodes}
        </ul>

        {section}
      </div>
    );
  }
}

class DetailSection extends Component {
  _wrapQuoteIfNeed(value) {
    return value.indexOf(' ') > -1 ? `"${value}"` : value;
  }
  render() {
    const servant = this.props.servant || {};

    const createStatusNodes = (rows) => {
      return _.map(servant.status, (status, level) => {
        return (
          <StatusItem key={level} rows={rows} level={level} {...status} />
        );
      });
    };

    const createSkillNode = (type) => {
      const skill = servant.skill ? servant.skill[type] : {};
      return (
        <SkillItem key={type} type={type} {...skill} />
      );
    };

    return (
      <div className="detail">
        <div className="row">
          <div className="col-lg-4 col-md-5 col-sm-5">
            <div className="col-sm-12" className="logo">
              <a href={`assets/img/l/${servant.id}.jpg`} target="_self">
                <img src={servant.id ? `assets/img/l/${servant.id}.jpg` : ''}
                     className="center-block img-rounded img-responsive" />
              </a>
            </div>
          </div>
          <div className="col-lg-8 col-md-7 col-sm-7">
            <div className="row">
              <div className="col-sm-6">
                <dl className="row">
                  <dt className="col-xs-3">Tribe</dt>
                  <dd className="col-xs-9">
                    <Link to="/servants/" query={{tribe_id: servant.tribe_id}}>
                      {servant.tribe_name}
                    </Link>-{_.padLeft(servant.tribe_code, 3, 0)}
                  </dd>
                </dl>
                <dl className="row">
                  <dt className="col-xs-3">Type</dt>
                  <dd className="col-xs-9">
                    <Link to="/servants/" query={{q: `type:${servant.type}`}}>{servant.type}</Link>
                  </dd>
                </dl>
                <dl className="row">
                  <dt className="col-xs-3">Cost</dt>
                  <dd className="col-xs-9">
                    <Link to="/servants/" query={{q: `cost:${servant.cost}`}}>{servant.cost}</Link>
                  </dd>
                </dl>
              </div>
              <div className="col-sm-6">
                <dl className="row">
                  <dt className="col-xs-3">Released</dt>
                  <dd className="col-xs-9">
                    {new Intl.DateTimeFormat().format(new Date(servant.release_date || new Date))}
                  </dd>
                </dl>
                <dl className="row">
                  <dt className="col-xs-3">Updated</dt>
                  <dd className="col-xs-9">
                    {new Intl.DateTimeFormat().format(new Date(servant.update_date || new Date))}
                  </dd>
                </dl>
                <dl className="row">
                  <dt className="col-xs-3">Range</dt>
                  <dd className="col-xs-9">
                    <Link to="/servants/" query={{q: `range:${servant.range}`}}>{servant.range}</Link>
                  </dd>
                </dl>
              </div>
            </div>
            <dl className="row">
              <dt className="col-sm-12">Oral Tradition</dt>
              <dd className="col-sm-12">
                <div className="well well-sm">
                  <small>{servant.oral_tradition}</small>
                </div>
              </dd>
            </dl>
            <div className="row">
              <dl className="col-sm-6 row">
                <dt className="col-xs-3">Illust</dt>
                <dd className="col-xs-9">
                  <Link to="/servants/" query={{q: `illustrationBy:${this._wrapQuoteIfNeed(servant.illustration_by || '')}`}}>
                    {servant.illustration_by}
                  </Link>
                </dd>
              </dl>
              <dl className="col-sm-6 row">
                <dt className="col-xs-3">CV</dt>
                <dd className="col-xs-9">
                  <Link to="/servants/" query={{q: `characterVoice:${this._wrapQuoteIfNeed(servant.character_voice || '')}`}}>
                    {servant.character_voice}
                  </Link>
                </dd>
              </dl>
            </div>
            <div className="status">
              <dl>
                <dt><b>Status</b></dt>
                <dd className="col-xs-12">
                  <table className="table visible-md visible-lg">
                    <thead>
                    <tr>
                      <th className="">Level</th>
                      <th className="">HP</th>
                      <th className="">AP</th>
                      <th className="">ATK</th>
                      <th className="">POW</th>
                      <th className="">DEF</th>
                      <th className="">RES</th>
                      <th className="">MS</th>
                      <th className="">AS</th>
                    </tr>
                    </thead>
                    {createStatusNodes(1)}
                  </table>
                  <table className="table hidden-md hidden-lg">
                    <thead>
                    <tr>
                      <th rowSpan="2">Level</th>
                      <th className="">HP</th>
                      <th className="">ATK</th>
                      <th className="">DEF</th>
                      <th className="">MS</th>
                    </tr>
                    <tr>
                      <th className="">AP</th>
                      <th className="">POW</th>
                      <th className="">RES</th>
                      <th className="">AS</th>
                    </tr>
                    </thead>
                    {createStatusNodes(2)}
                  </table>
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="skill" className="row">
          <dl className="col-sm-6">
            <dt><b>Active Skill</b></dt>
            {createSkillNode('active')}
          </dl>
          <dl className="col-sm-6">
            <dt><b>Passive Skill</b></dt>
            {createSkillNode('passive')}
          </dl>
        </div>
      </div>
    );
  }
}

class StatusItem extends Component {
  render() {
    if (this.props.rows === 1) {
      return (
        <tbody>
        <tr>
          <td className="">{this.props.level}</td>
          <td className="">{this.props.hp}</td>
          <td className="">{this.props.ap}</td>
          <td className="">{this.props.atk}</td>
          <td className="">{this.props.pow}</td>
          <td className="">{this.props.def}</td>
          <td className="">{this.props.res}</td>
          <td className="">{this.props.ms}</td>
          <td className="">{this.props.as.toFixed(2)}</td>
        </tr>
        </tbody>
      );
    }
    return (
      <tbody>
      <tr>
        <td rowSpan="2">{this.props.level}</td>
        <td className="">{this.props.hp}</td>
        <td className="">{this.props.atk}</td>
        <td className="">{this.props.def}</td>
        <td className="">{this.props.ms}</td>
      </tr>
      <tr>
        <td className="">{this.props.ap}</td>
        <td className="">{this.props.pow}</td>
        <td className="">{this.props.res}</td>
        <td className="">{this.props.as.toFixed(2)}</td>
      </tr>
      </tbody>
    );
  }
}

class SkillItem extends Component {
  _descriptionHTML() {
    let html = this.props.description;

    html = html
      .replace(/(^|\n)\d+\.\s/g, '$1')
      .replace(/\n/g, '<br /><br />')
      .replace(/［([^］]+)］/g, '<br/>&nbsp;&nbsp;<b>- $1</b>')
      .replace(/：/g, ' : ');

    let cd = this.props.cd;
    if (cd && cd.length) {
      cd = '- クールダウン : ' + cd.join(' / ');
      html = html.replace(/<br *\/>/, '<br />&nbsp;&nbsp;<b>' + cd + '</b><br />');
    }

    let ap = this.props.ap;
    if (ap && cd.length) {
      ap = '- 消費AP : ' + ap.join(' / ');
      html = html.replace(/<br *\/>/, '<br />&nbsp;&nbsp;<b>' + ap + '</b><br />');
    }

    return html;
  }
  render() {
    if (!this.props.name) {
      return (
        <dd>
          <div className="well well-sm">
            <small>None</small>
          </div>
        </dd>
      );
    }
    return (
      <dd>
        <dl className="row">
          <dt className="col-xs-3">Name</dt>
          <dd className="col-xs-9">{this.props.name}</dd>
        </dl>
        <dl className="row">
          <dt className="col-xs-3">Designation</dt>
          <dd className="col-xs-9">{(this.props.designation || '').replace(',', '・') || '-'}</dd>
        </dl>
        <dl className="row">
          <dt className="col-xs-3">Effect</dt>
          <dd className="col-xs-9">{(this.props.effect || '').replace(',', '・') || '-'}</dd>
        </dl>
        <dl className="row">
          <dt className="col-sm-12">Description</dt>
          <dd className="col-sm-12">
            <div className="well well-sm">
              <small dangerouslySetInnerHTML={{__html: this._descriptionHTML()}} />
            </div>
          </dd>
        </dl>
      </dd>
    );
  }
}

class StatisticsSection extends Component {
  state = {
    map: 'all',
    queue: 'all',
    statistics: []
  };
  constructor() {
    super();
    this._onChange = this._onChange.bind(this);
  }
  _getWinChart() {
    let datum = [];
    datum.push({
      key: 'Win Rate',
      area: true,
      color: '#1f77b4',
      values: _.filter(this.state.statistics, {mode: 'win'}).map((statistic) => {
        return {x: new Date(statistic.date), y: statistic.score};
      })
    });
    datum.push({
      key: 'Average',
      area: false,
      color: '#ff7f0e',
      values: _.filter(this.state.statistics, {mode: 'win'}).map((statistic) => {
        return {x: new Date(statistic.date), y: 50};
      })
    });

    return {
      type: 'lineChart',
      datum: datum,
      width: '100%',
      height: 350,
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
        axisLabel: 'Rate (%)',
        tickFormat: function(d){
          return d3.format('.02f')(d);
        },
        axisLabelDistance: -10
      }
    };
  }
  _getUsedChart() {
    let datum = [];
    datum.push({
      key: 'Used Rate',
      area: true,
      color: '#9467bd',
      values: _.filter(this.state.statistics, {mode: 'used'}).map((statistic) => {
        return {x: new Date(statistic.date), y: statistic.score};
      })
    });
    datum.push({
      key: 'Average',
      area: false,
      color: '#ff7f0e',
      values: _.filter(this.state.statistics, {mode: 'used'}).map((statistic) => {
        return {x: new Date(statistic.date), y: 100 / 221};
      })
    });

    return {
      type: 'lineChart',
      datum: datum,
      width: '100%',
      height: 350,
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
        axisLabel: 'Rate (%)',
        tickFormat: function(d){
          return d3.format('.02f')(d);
        },
        axisLabelDistance: -10
      }
    };
  }
  _handleOptionClick(e) {
    const options = _.reduce(this.refs, (previous, value, key) => {
      if (value.checked) {
        previous[value.name] = value.value;
      }
      return previous;
    }, {});
    this.setState(options);
    ServantStatisticAction.fetchServantStatistics({
      servant_id: +this.props.servant.id,
      map: options.map,
      queue: options.queue
    });
  }
  _onChange() {
    this.setState({
      statistics: ServantStatisticStore.getServantStatistics({
        servant_id: +this.props.servant.id,
        map: this.state.map,
        queue: this.state.queue
      })
    });
  }
  componentDidMount() {
    // TODO: dont use jquery
    $('.statistics :radio').radiocheck();
    ServantStatisticStore.addChangeListener(this._onChange);
    ServantStatisticAction.fetchServantStatistics({
      servant_id: +this.props.servant.id,
      map: this.state.map,
      queue: this.state.queue
    });
  }
  componentWillUnmount() {
    ServantStatisticStore.removeChangeListener(this._onChange);
  }
  render() {
    const mapOptionNodes = [
      {value: 'all',       name: 'All'},
      {value: 'vermilion', name: 'Vermilion'},
      {value: 'braze',     name: 'Braze'}
    ].map((option, index) => {
      const active = option.value === 'all';
      return (
        <label key={index} className="radio radio-inline">
          <input ref={`map-${option.value}`} type="radio" name="map" value={option.value} defaultChecked={active} onClick={this._handleOptionClick.bind(this)} />{option.name}
        </label>
      );
    });

    const queueOptionNodes = [
      {value: 'all',    name: 'All'},
      {value: 'normal', name: 'Normal'},
      {value: 'solo',   name: 'Solo'}
    ].map((option, index) => {
      const active = option.value === 'all';
      return (
        <label key={index} className="radio radio-inline">
          <input ref={`queue-${option.value}`} type="radio" name="queue" value={option.value} defaultChecked={active} onClick={this._handleOptionClick.bind(this)} />{option.name}
        </label>
      );
    });

    const winChart = this._getWinChart();
    const usedChart = this._getUsedChart();

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

        <NVD3Chart {...winChart} />
        <NVD3Chart {...usedChart} />
      </div>
    );
  }
}
