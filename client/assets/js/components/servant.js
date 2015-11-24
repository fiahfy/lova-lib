import React, {Component} from 'react';
import classNames from 'classnames';
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
  _onClickView(view) {
    this.setState({view: view});
  }
  _handleServantClick(servantId) {
    History.pushState(null, `/servants/${servantId}/`);
  }
  _onChange() {
    this.setState({
      servants: ServantStore.servants
    });
  }
  componentDidMount() {
    ServantStore.addChangeListener(this._onChange);
    ServantAction.fetchAll();
  }
  componentWillUnmount() {
    ServantStore.removeChangeListener(this._onChange);
  }
  render() {
    let servantNodes = this.state.servants.map((servant) => {
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
            <select className="form-control select select-primary select-block mbl" ui-select2>
              {/*<option ng-repeat="option in c.tribeIdOptions" value="{{ option.key }}">{{ option.value }}</option>*/}
            </select>
          </div>
        </div>

        <div className="form-group">
          <input type="text" placeholder="Input Keyword..." className="form-control"
                  />
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
