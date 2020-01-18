import { CssBaseline } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { StylesProvider } from '@material-ui/styles';
import React from 'react';
import { Provider } from 'react-redux';
import LoadingBar from 'react-redux-loading-bar';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import AuthenticatedPages from './../components/layouts/AuthenticatedPages';
import theme from './../theme';
import './App.css';
import configureStore from './store';

const store = configureStore();

const loadingBarStyle: React.CSSProperties = {
  backgroundColor: 'orange',
  height: '3px',
  position: 'fixed',
  top: '0',
  zIndex: 100
};

const App: React.FC<{}> = () => {
  return (
    <Provider store={store}>
      <StylesProvider>
        <MuiThemeProvider theme={theme}>
          <>
            <CssBaseline />
            <LoadingBar style={loadingBarStyle} updateTime={150} />
            <BrowserRouter>
              <Switch>
                <Route path='/' component={AuthenticatedPages} />
              </Switch>
            </BrowserRouter>
          </>
        </MuiThemeProvider>
      </StylesProvider>
    </Provider>
  );
};

export default App;
