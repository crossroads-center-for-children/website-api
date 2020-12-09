import React from 'react';

import { Route, Switch } from 'react-router-dom';

import { Box } from '@material-ui/core';

import ResourcesPage from './ResourcesPage';

export default function Pages() {
  return (
    <Switch>
      <Route exact path='/classes/:id'></Route>
      <Route exact path='/resources' component={ResourcesPage}></Route>
    </Switch>
  );
}
