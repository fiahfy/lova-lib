import React, {Component} from 'react';
import classNames from 'classnames';
import History from '../history';
import ServantAction from '../actions/servant';
import ServantStore from '../stores/servant';

export default class ServantDetail extends Component {
  state = {
    servant: null
  };
  constructor() {
    super();
    this._onChange = this._onChange.bind(this);
  }
  _handleQueryChange() {
    this.forceUpdate();
  }
  _onChange() {
    this.setState({
      servant: ServantStore.getServant(this.props.params.id)
    });
  }
  componentDidMount() {
    ServantStore.addChangeListener(this._onChange);
    ServantAction.fetchServant(this.props.params.id);
  }
  componentWillUnmount() {
    ServantStore.removeChangeListener(this._onChange);
  }
  render() {
    const {query} = this.props.location;

    const servant = this.state.servant || {};

    console.log(servant);
    const skillNodes = (servant.skill || []).map((skill) => {
      return (
        <tr>
          <td className="">{skill.level}</td>
          <td className="">{skill.hp}</td>
          <td className="">{skill.ap}</td>
          <td className="">{skill.atk}</td>
          <td className="">{skill.pow}</td>
          <td className="">{skill.def}</td>
          <td className="">{skill.res}</td>
          <td className="">{skill.ms}</td>
          <td className="">{skill.as.toFixed(2)}</td>
        </tr>
      );
    });

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
          <li role="presentation" ng-className="{'active': c.hash == 'detail'}"><a href="#detail">Detail</a></li>
          <li role="presentation" ng-className="{'active': c.hash == 'statistics'}"><a href="#statistics">Statistics</a></li>
        </ul>

        <div className="detail">
          <div className="row">
            <div className="col-lg-4 col-md-5 col-sm-5">
              <div className="col-sm-12" className="logo">
                <a href="assets/img/l/{{ c.servant.id }}.jpg" target="_self">
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
                      <a href={`/servants/?tribe_id=${servant.tribe_id}`}>
                        {servant.tribe_name}
                      </a>-{`000${servant.tribe_code}`.slice(-3)}
                    </dd>
                  </dl>
                  <dl className="row">
                    <dt className="col-xs-3">Type</dt>
                    <dd className="col-xs-9">
                      <a href={`/servants/?q=type:${servant.type}`}>{servant.type}</a>
                    </dd>
                  </dl>
                  <dl className="row">
                    <dt className="col-xs-3">Cost</dt>
                    <dd className="col-xs-9">
                      <a href={`/servants/?q=cost:${servant.cost}`}>{servant.cost}</a>
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
                      <a href={`/servants/?q=range:${servant.range}`}>{servant.range}</a>
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
                    <a href={`/servants/?q=illustrationBy:${(servant.illustration_by || '').replace(' ', '+')}`}>
                      {servant.illustrationBy}
                    </a>
                  </dd>
                </dl>
                <dl className="col-sm-6 row">
                  <dt className="col-xs-3">CV</dt>
                  <dd className="col-xs-9">
                    <a href={`/servants/?q=characterVoice:${(servant.character_voice || '').replace(' ', '+')}`}>
                      {servant.characterVoice}
                    </a>
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
                      <tbody>
                        {skillNodes}
                      </tbody>
                    </table>
                  {/*
                    <table className="table hidden-md hidden-lg">
                      <thead>
                      <tr>
                        <th rowspan="2">Level</th>
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
                      <tbody ng-repeat="status in c.servant.status">

                      </tbody>
                    </table>*/}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="skill" className="row">
            <dl className="col-sm-6">
              <dt><b>Active Skill</b></dt>{/*
              <dd ng-if="c.servant.skill.active">
                <dl className="row">
                  <dt className="col-xs-3">Name</dt>
                  <dd className="col-xs-9">{{ c.servant.skill.active.name }}</dd>
                </dl>
                <dl className="row">
                  <dt className="col-xs-3">Designation</dt>
                  <dd className="col-xs-9">{{ c.servant.skill.active.designation|replace:',':'・'|default:'-' }}</dd>
                </dl>
                <dl className="row">
                  <dt className="col-xs-3">Effect</dt>
                  <dd className="col-xs-9">{{ c.servant.skill.active.effect|replace:',':'・'|default:'-' }}</dd>
                </dl>
                <dl className="row">
                  <dt className="col-sm-12">Description</dt>
                  <dd className="col-sm-12">
                    <div className="well well-sm">
                      <small ng-bind-html="c.servant.skill.active|skillDescription"></small>
                    </div>
                  </dd>
                </dl>
              </dd>
              <dd ng-if="!c.servant.skill.active">
                <div className="well well-sm">
                  <small>None</small>
                </div>
              </dd>*/}
            </dl>
            <dl className="col-sm-6">
              <dt><b>Passive Skill</b></dt>{/*
              <dd ng-if="c.servant.skill.passive">
                <dl className="row">
                  <dt className="col-xs-3">Name</dt>
                  <dd className="col-xs-9">{{ c.servant.skill.passive.name }}</dd>
                </dl>
                <dl className="row">
                  <dt className="col-xs-3">Designation</dt>
                  <dd className="col-xs-9">{{ c.servant.skill.passive.designation|replace:',':'・'|default:'-' }}</dd>
                </dl>
                <dl className="row">
                  <dt className="col-xs-3">Effect</dt>
                  <dd className="col-xs-9">{{ c.servant.skill.passive.effect|replace:',':'・'|default:'-' }}</dd>
                </dl>
                <dl className="row">
                  <dt className="col-sm-12">Description</dt>
                  <dd className="col-sm-12">
                    <div className="well well-sm">
                      <small ng-bind-html="c.servant.skill.passive|skillDescription"></small>
                    </div>
                  </dd>
                </dl>
              </dd>
              <dd ng-if="!c.servant.skill.passive">
                <div className="well well-sm">
                  <small>None</small>
                </div>
              </dd>*/}
            </dl>
          </div>
        </div>
        {/*
        <div className="statistics">
          <form className="form-horizontal">
            <div className="form-group">
              <label className="control-label col-xs-12 col-sm-2">Map</label>
              <div className="col-xs-12 col-sm-10 text-left">
                <label className="radio radio-inline" ng-repeat="mapOption in c.mapOptions">
                  <input type="radio" name="map" value="{{ mapOption.key }}" ng-model="c.map" ng-change="c.updateStatistics()">{{ mapOption.value }}
                </label>
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-xs-12 col-sm-2">Queue</label>
              <div className="col-xs-12 col-sm-10 text-left">
                <label className="radio radio-inline" ng-repeat="queueOption in c.queueOptions">
                  <input type="radio" name="queue" value="{{ queueOption.key }}" ng-model="c.queue" ng-change="c.updateStatistics()">{{ queueOption.value }}
                </label>
              </div>
            </div>
          </form>

          <nvd3 options='c.graph1Options' data='c.graph1Data'></nvd3>
          <nvd3 options='c.graph2Options' data='c.graph2Data'></nvd3>
        </div>*/}
      </div>
    );
  }
}
