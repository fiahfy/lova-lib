import React from 'react'
import {Route, IndexRedirect} from 'react-router'
import App from './containers/app'
import Servant from './containers/servant'
import ServantDetail from './containers/servant-detail'
import Combination from './containers/combination'
import Deck from './containers/deck'
import Chart from './containers/chart'
import Prize from './containers/prize'
import About from './containers/about'

export default (
  <Route path="/" component={App}>
    <IndexRedirect to="deck/" />
    <Route path="deck/" component={Deck} />
    <Route path="deck/:hash/" component={Deck} />
    <Route path="servants/" component={Servant} />
    <Route path="servants/:id/" component={ServantDetail} />
    <Route path="servants/:id/:section/" component={ServantDetail} />
    {/*<Route path="combinations/" component={Combination} />*/}
    <Route path="charts/" component={Chart} />
    <Route path="prize/" component={Prize} />
    <Route path="about/" component={About} />
  </Route>
)
