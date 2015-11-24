import React, {Component} from 'react';
import classNames from 'classnames';
import jQuery from 'jquery';
import History from '../history';
import ServantAction from '../actions/servant';
import ServantStore from '../stores/servant';

export default class Servant extends Component {
  state = {
    servants: []
  };
  constructor() {
    super();
    this._onChange = this._onChange.bind(this);
  }
  _handleServantClick(servantId) {
    History.pushState(null, `/servants/${servantId}/`);
  }
  _handleQueryChange() {
    this.forceUpdate();
  }
  _onChange() {
    this.setState({
      servants: ServantStore.servants
    });
  }
  _createServantsFilter() {
    let {query} = this.props.location;
    let filters = [];

    let q = this.refs.q ? this.refs.q.value : query.q;
    if (q) {
      filters = q.split(/[\s　]/i).map((e) => {
        let [key, value] = e.split(':');
        if (!value) {
          return {key: 'name', value: key};
        }
        return {key: key, value: value.replace('+', ' ')};
      });
    }

    if (query.tribe_id > 0) {
      filters.push({key: 'tribe_id', value: query.tribe_id});
    }

    return (servant) => {
      return filters.every((filter) => {
        return servant[filter.key].toString().indexOf(filter.value) > -1;
      });
    };
  }
  componentDidMount() {
    // TODO: dont use jquery
    jQuery(this.refs.uiSelect).select2().on('select2-selecting', (e) => {
      History.pushState(null, `/servants/?tribe_id=${e.val}`);
    });
    ServantStore.addChangeListener(this._onChange);
    ServantAction.fetchAll();
  }
  componentWillUnmount() {
    ServantStore.removeChangeListener(this._onChange);
  }
  render() {
    let {query} = this.props.location;

    let tribeIdOptionNodes = [
      {key: 0, value: 'Select Tribe...'},
      {key: 1, value: '人獣'},
      {key: 2, value: '神族'},
      {key: 3, value: '魔種'},
      {key: 4, value: '海種'},
      {key: 5, value: '不死'}
    ].map((e) => {
      return (
        <option key={`tribe-id-${e.key}`} value={e.key}>
          {e.value}
        </option>
      );
    });

    let servantNodes = this.state.servants.filter(this._createServantsFilter()).map((servant) => {
      let cls = classNames('clip', `tribe-${servant.tribe_id}`);
      let style = {backgroundPositionX: `${-40*(servant.tribe_code-1)}px`};
      return (
        <tr key={servant.id} onClick={this._handleServantClick.bind(this, servant.id)}>
          <th className="hidden-xs" scope="row">{servant.id}</th>
          <td className={cls} style={style}>　</td>
          <td className="">{`${servant.tribe_name}-${`000${servant.tribe_code}`.slice(-3)}`}</td>
          <td className="">{servant.cost}</td>
          <td className="hidden-xs">{servant.type}</td>
          <td className="">{servant.name}</td>
          <td className="hidden-xs hidden-sm">{servant.win_rate.toFixed(2)}</td>
          <td className="hidden-xs hidden-sm">{servant.used_rate.toFixed(2)}</td>
          <td className="hidden-xs hidden-sm">{new Intl.DateTimeFormat().format(new Date(servant.release_date))}</td>
          <td className="hidden-xs hidden-sm">{new Intl.DateTimeFormat().format(new Date(servant.update_date))}</td>
        </tr>
      );
    });

    return (
      <div className="container" id="servant">
        <div className="page-header">
          <h2>Servants</h2>
        </div>

        <div className="clearfix">
          <div className="pull-left">
            <select className="form-control select select-primary select-block mbl"
                    ref="uiSelect" defaultValue={query.tribe_id}>
              {tribeIdOptionNodes}
            </select>
          </div>
        </div>

        <div className="form-group">
          <input type="text" placeholder="Input Keyword..." className="form-control"
                 ref="q" defaultValue={query.q} onChange={this._handleQueryChange.bind(this)} />
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
    );
  }
}
