import React from 'react';
import PrizeAction from '../actions/prize';
import PrizeStore from '../stores/prize';

export default class Prize extends React.Component {
  state = {prizes: []};
  constructor() {
    super();
    this._onChange = this._onChange.bind(this);
  }
  _onChange() {
    this.setState({prizes: PrizeStore.prizes});
  }
  componentDidMount() {
    PrizeStore.addChangeListener(this._onChange);
    PrizeAction.fetch();
  }
  componentWillUnmount() {
    PrizeStore.removeChangeListener(this._onChange);
  }
  render() {
    let prizeNodes = this.state.prizes.map((prize) => {
      return (
        <tr key={prize.id}>
          <td className="">{prize.name}</td>
          <td className="">{prize.rate.toFixed(3)}</td>
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
                <button className="btn btn-primary">Draw</button>
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
              {/*
              <tr ng-repeat="($index, prize) in c.results track by $index">
                <td className="">{{ $index + 1 }}</td>
                <td className="">{{ prize.name }}</td>
              </tr>
              /*}
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
                <small>Updated 'yyyy-MM-dd'</small>
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
