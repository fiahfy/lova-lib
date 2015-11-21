import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, Link, IndexRoute} from 'react-router'
import createBrowserHistory from 'history/lib/createBrowserHistory'
import CommentBox from './components/CommentComponents';
import App from './components/app';

import 'jquery/dist/jquery';
import 'flat-ui/dist/js/flat-ui';

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
