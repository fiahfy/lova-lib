import React, {Component} from 'react';
import PrizeAction from '../actions/prize';
import PrizeLotAction from '../actions/prize-lot';
import PrizeStore from '../stores/prize';
import PrizeLotStore from '../stores/prize-lot';

export default class Prize extends Component {
  state = {
    prizes: [],
    lotResults: []
  };
  constructor() {
    super();
    this._onChange = this._onChange.bind(this);
  }
  _onClick() {
    PrizeLotAction.draw(10);
  }
  _onChange() {
    this.setState({
      prizes: PrizeStore.prizes,
      lotResults: PrizeLotStore.results
    });
  }
  componentDidMount() {
    PrizeStore.addChangeListener(this._onChange);
    PrizeLotStore.addChangeListener(this._onChange);
    PrizeAction.fetch();
  }
  componentWillUnmount() {
    PrizeStore.removeChangeListener(this._onChange);
    PrizeLotStore.removeChangeListener(this._onChange);
  }
  render() {
    let updated = this.state.prizes[0] ? new Intl.DateTimeFormat().format(new Date(this.state.prizes[0].date)) : '';

    let prizeNodes = this.state.prizes.map((prize) => {
      return (
        <tr key={prize.id}>
          <td className="">{prize.name}</td>
          <td className="">{prize.rate.toFixed(3)}</td>
        </tr>
      );
    });

    let i = 0;
    let lotResultsNodes = this.state.lotResults.map((result) => {
      i++;
      return (
        <tr key={i}>
          <td className="">{i}</td>
          <td className="">{result.name}</td>
        </tr>
      );
    });

    return (
      <div className="container" id="prize">
        <div className="page-header">
          <h2>Prize</h2>
        </div>

        <div className="row">
          <div className="col-sm-6">
            <div className="clearfix">
              <h3>Draw Lots</h3>
            </div>

            <div className="input-group pull-left">
              <input type="text" className="form-control" min="1" max="1000" placeholder="1-1000" />
              <span className="input-group-btn">
                <button className="btn btn-primary" onClick={this._onClick.bind(this)}>Draw</button>
              </span>
            </div>

            <div className="btn-toolbar pull-right">
              <div className="btn-group">
                {/*
                <a className="btn btn-primary" ng-repeat="option in c.viewOptions"
                   ng-className="{active: option.key == c.view}" ng-click="c.selectView(option.key)">
                  <span className="{{ option.icon }}"></span>
                </a>
                */}
              </div>
            </div>

            <table className="table table-hover">
              <thead>
              <tr>
                <th className="">#</th>
                <th className="">Name</th>
              </tr>
              </thead>
              <tbody>
                {lotResultsNodes}
              </tbody>
            </table>

            <table className="table table-hover">
              <thead>
              <tr>
                <th className="">Name</th>
                <th className="">Count</th>
                <th className="">Rate</th>
              </tr>
              </thead>
              <tbody>
              {/*
              <tr ng-repeat="result in c.resultSummary | orderBy:['count']:true">
                <td className="">{{ result.prize.name }}</td>
                <td className="">{{ result.count }}</td>
                <td className="">{{ result.count / c.resultTimes|number:3 }}</td>
              </tr>
              */}
              </tbody>
            </table>
          </div>

          <div className="col-sm-6">
            <div className="clearfix">
              <h3>Prize List
                <small>Updated {updated}</small>
                <small className="pull-right"><a href="http://lova.jp/prizelist/">to Official Prize List Page</a></small>
              </h3>
            </div>

            <table className="table table-hover">
              <thead>
              <tr>
                <th className="">Name</th>
                <th className="">Rate</th>
              </tr>
              </thead>
              <tbody>
                {prizeNodes}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}
