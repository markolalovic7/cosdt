import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from "react-router-dom";
import { RecoilRoot } from 'recoil';

import './assets/css/App.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  // <React.StrictMode>
  <RecoilRoot>
    <Router>
    <App />
  </Router>
  </RecoilRoot>,
  // </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
