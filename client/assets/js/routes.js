import React from 'react';
import {Route, IndexRedirect, Redirect} from 'react-router'
import App from './components/app';
import Servant from './components/servant';
import ServantDetail from './components/servant-detail';
import Deck from './components/deck/deck';
import Chart from './components/chart';
import Prize from './components/prize';
import About from './components/about';

export default (
  <Route path="/" component={App}>
    <IndexRedirect to="deck/" />
    <Route path="deck/" component={Deck} />
    <Route path="deck/:hash/" component={Deck} />
    <Route path="servants/" component={Servant} />
    <Route path="servants/:id/" component={ServantDetail} />
    <Route path="charts/" component={Chart} />
    <Route path="prize/" component={Prize} />
    <Route path="about/" component={About} />
    <Redirect from="*" to="/" />
  </Route>
);
