import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

import './index.css';

import { BioCapture, AgendaCapture, Main } from './js/pages';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <Router>
    <Switch>
      <Route exact path="/" component={Main} />
      <Route exact path="/bio-capture" component={BioCapture} />
      <Route exact path="/agenda-capture" component={AgendaCapture} />
    </Switch>
  </Router>,
  document.getElementById('root'),
);
serviceWorker.unregister();
