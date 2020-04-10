import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';

import PrivateLayout from '@components/layouts/private';
import { PrivateRoute } from '@components/routes';

import Account from './account';
import Dashboard from './dashboard';
import Products from './products';
import Teams from './teams';
import Settings from './settings';
import Users from './users';

export default function PrivateRoutes() {
  return (
    <PrivateLayout>
      <Switch>
        <PrivateRoute path='/admin/account' component={Account} />
        <PrivateRoute path='/admin/dashboard' component={Dashboard} />
        <PrivateRoute path='/admin/products' component={Products} />
        <PrivateRoute path='/admin/teams' component={Teams} />
        <PrivateRoute path='/admin/settings' component={Settings} />
        <PrivateRoute path='/admin/users' component={Users} />
        <Route
          exact
          path='/admin'
          render={props => <Redirect to='/admin/dashboard' {...props} />}
        />
        <PrivateRoute path='*' component={Dashboard} />
      </Switch>
    </PrivateLayout>
  );
}
