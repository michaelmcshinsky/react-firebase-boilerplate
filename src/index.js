import React from 'react';
import ReactDOM from 'react-dom';

import AppProviders from './services/context';
import Routes from './routes';
import * as serviceWorker from './serviceWorker';

import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/styles/main.scss';

ReactDOM.render(
  <AppProviders>
    <Routes />
  </AppProviders>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
