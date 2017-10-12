// @flow
import React from 'react';
import {render} from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import App from './app';

import './styles';

render(
  <MuiThemeProvider>
    <App/>
  </MuiThemeProvider>,
  document.getElementById('root')
);
