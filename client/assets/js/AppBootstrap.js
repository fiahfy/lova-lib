import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, Link, IndexRoute} from 'react-router'
import createBrowserHistory from 'history/lib/createBrowserHistory'
import CommentBox from './components/CommentComponents';
import App from './components/App';

//class App extends React.Component {
//  render() {
//    return (
//      <div>
//        <h1>App</h1>
//        <ul>
//          <li><Link to="/">Home</Link></li>
//          <li><Link to="/comments/">Comments</Link></li>
//        </ul>
//        {this.props.children}
//      </div>
//    )
//  }
//}

class Home extends React.Component {
  render() {
    return (
      <div>
        Home
      </div>
    )
  }
}

class NotFound extends React.Component {
  render() {
    return (
      <div>
        not found
      </div>
    )
  }
}

let history = createBrowserHistory();
let routes = (
  <Route path="/" component={App}>
    <IndexRoute component={Home} />
    <Route path="comments/" component={NotFound} />
    <Route path="*" component={NotFound} />
  </Route>
);

ReactDOM.render(
  <Router routes={routes} history={history} />,
  document.querySelector('#app')
);
