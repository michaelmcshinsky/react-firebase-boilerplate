import React from 'react';
import { Switch } from 'react-router-dom';
import { PublicDefaultLayout, PublicRoute } from '@/components';

import Home from './home';
import Contact from './Contact';
import NotFound from './NotFound';
import ForgotPassword from './ForgotPassword';
import Login from './Login';
import Register from './Register';

export function PublicRoutes () {
  return (
    <PublicDefaultLayout>
      <Switch>
        <PublicRoute
          exact
          path="/"
          component={ Home }
        />
        <PublicRoute
          path="/contact"
          component={ Contact }
        />
        <PublicRoute
          path="/login"
          restricted
          component={ Login }
        />
        <PublicRoute
          path="/register"
          restricted
          component={ Register }
        />
        <PublicRoute
          path="/forgot-password"
          restricted
          component={ ForgotPassword }
        />
        <PublicRoute
          path="*"
          component={ NotFound }
        />
      </Switch>
    </PublicDefaultLayout>
  );
}
