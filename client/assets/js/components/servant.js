import React, {Component} from 'react';
import classNames from 'classnames';
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
    this.props.history.pushState(null, `/servants/${servantId}/`);
  }
  _handleQueryChange() {
    this.forceUpdate();
  }
  _onChange() {
    this.setState({
      servants: ServantStore.getServants()
    });
  }
  _getPredicate() {
    const {query} = this.props.location;
    let filters = {};

    const q = this.refs.q ? this.refs.q.value : query.q;
    if (q) {
      let i = 0;
      let map = new Map();
      filters = q.replace(/"[^"]*"/g, (match) => {
        map.set(i, match.replace(/^"(.*)"$/, "$1"));
        return `@${i++}@`;
      }).split(/[\s　]/i).map((element) => {
        return element.replace(/@(\d+)@/, (match, i) => {
          return map.get(+i);
        });
      }).reduce((p, c) => {
        const [key, value] = c.split(':');
        if (!value) {
          p['name'] = value;
          return p;
        }
        p[_.snakeCase(key)] = isNaN(value) ? value : +value;
        return p
      }, filters);
    }

    if (query.tribe_id > 0) {
      filters['tribe_id'] = +query.tribe_id;
    }

    return filters;
  }
  componentDidMount() {
    // TODO: dont use jquery
    $('#servant').find('select').select2().on('select2-selecting', (e) => {
      this.props.history.pushState(null, '/servants/', {tribe_id: e.val});
    });
    ServantStore.addChangeListener(this._onChange);
    ServantAction.fetchServants();
  }
  componentWillUnmount() {
    ServantStore.removeChangeListener(this._onChange);
  }
  render() {
    const {query} = this.props.location;

    const tribeIdOptionNodes = [
      {value: 0, name: 'Select Tribe...'},
      {value: 1, name: '人獣'},
      {value: 2, name: '神族'},
      {value: 3, name: '魔種'},
      {value: 4, name: '海種'},
      {value: 5, name: '不死'}
    ].map((option, index) => {
      return (
        <option key={index} value={option.value}>
          {option.name}
        </option>
      );
    });

    const servantNodes = _.filter(this.state.servants, this._getPredicate()).sort((a, b) => {
      return (a.tribe_id * 1000 + a.tribe_code) - (b.tribe_id * 1000 + b.tribe_code);
    }).map((servant, index) => {
      const cls = classNames('clip', `tribe-${servant.tribe_id}`);
      const style = {backgroundPositionX: `${-40*(servant.tribe_code-1)}px`};
      return (
        <tr key={index} onClick={this._handleServantClick.bind(this, servant.id)}>
          <th className="hidden-xs" scope="row">{servant.id}</th>
          <td className={cls} style={style}>　</td>
          <td className="">{`${servant.tribe_name}-${_.padLeft(servant.tribe_code, 3, 0)}`}</td>
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
                    defaultValue={query.tribe_id}>
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
