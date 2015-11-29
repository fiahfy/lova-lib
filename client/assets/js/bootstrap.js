import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, Link, IndexRedirect, Redirect} from 'react-router'
import History from './history';
import App from './components/app';
import Servant from './components/servant';
import ServantDetail from './components/servant-detail';
import Deck from './components/deck';
import Chart from './components/chart';
import Prize from './components/prize';
import About from './components/about';

import 'flat-ui/dist/js/flat-ui';
import 'jquery-lazyload';

const routes = (
  <Route path="/" component={App}>
    <IndexRedirect to="deck/" />
    <Route path="deck/" component={Deck} />
    <Route path="servants/" component={Servant} />
    <Route path="servants/:id/" component={ServantDetail} />
    <Route path="charts/" component={Chart} />
    <Route path="prize/" component={Prize} />
    <Route path="about/" component={About} />
    <Redirect from="*" to="/" />
  </Route>
);

ReactDOM.render(
  <Router routes={routes} history={History} />,
  document.querySelector('#app')
);
