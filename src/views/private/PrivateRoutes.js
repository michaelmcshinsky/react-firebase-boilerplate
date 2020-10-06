import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { PrivateDefaultLayout, PrivateRoute } from '@/components';

import Account from './account';
import Dashboard from './dashboard';
import Products from './products';
import Posts from './posts';
import Settings from './settings';
import Users from './users';

export function PrivateRoutes () {
  return (
    <PrivateDefaultLayout>
      <Switch>
        <PrivateRoute
          path="/admin/account"
          component={ Account }
        />
        <PrivateRoute
          path="/admin/dashboard"
          component={ Dashboard }
        />
        <PrivateRoute
          path="/admin/products"
          component={ Products }
        />
        <PrivateRoute
          path="/admin/posts"
          component={ Posts }
        />
        <PrivateRoute
          path="/admin/settings"
          component={ Settings }
        />
        <PrivateRoute
          path="/admin/users"
          component={ Users }
        />
        <Route
          exact
          path="/admin"
          render={ props => (
            <Redirect
              to="/admin/dashboard"
              { ...props }
            />
          ) }
        />
        <PrivateRoute
          path="*"
          component={ Dashboard }
        />
      </Switch>
    </PrivateDefaultLayout>
  );
}
