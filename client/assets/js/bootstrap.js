import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, Link, IndexRedirect, Redirect} from 'react-router'
import History from './history';
import CommentBox from './components/CommentComponents';
import App from './components/app';
import Servant from './components/servant';
import Prize from './components/prize';
import About from './components/about';

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

let routes = (
  <Route path="/" component={App}>
    <IndexRedirect to="about/" />
    <Route path="servants/" component={Servant} />
    <Route path="prize/" component={Prize} />
    <Route path="about/" component={About} />
    <Redirect from="*" to="/" />
  </Route>
);

ReactDOM.render(
  <Router routes={routes} history={History} />,
  document.querySelector('#app')
);
