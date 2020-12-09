import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from './theme';

import Pages from './pages';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Switch>
          <Route component={Pages} />
        </Switch>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
