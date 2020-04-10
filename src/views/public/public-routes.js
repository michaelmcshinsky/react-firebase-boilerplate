import React from 'react';
import { Switch } from 'react-router-dom';
import PublicLayout from '@components/layouts/public';
import { PublicRoute } from '@components/routes';

import Home from './home';
import Contact from './contact';
import NotFound from './not-found';
import { ForgotPassword, Login, Register } from './auth';

export default function PublicRoutes() {
  return (
    <PublicLayout>
      <Switch>
        <PublicRoute exact path='/' component={Home} />
        <PublicRoute path='/contact' component={Contact} />
        <PublicRoute path='/login' restricted={true} component={Login} />
        <PublicRoute path='/register' restricted={true} component={Register} />
        <PublicRoute
          path='/forgot-password'
          restricted={true}
          component={ForgotPassword}
        />
        <PublicRoute path='*' component={NotFound} />
      </Switch>
    </PublicLayout>
  );
}
