import React from 'react';
import ReactDOM from 'react-dom';
import {Router} from 'react-router'
import history from './history';
import routes from './routes';

import 'flat-ui/dist/js/flat-ui';
import 'jquery-lazyload';

ReactDOM.render(
  <Router routes={routes} history={history} />,
  document.querySelector('#app')
);
