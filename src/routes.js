import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { isLoaded } from 'react-redux-firebase';
import { PublicRoutes, PrivateRoutes } from '@views';

export default function Routes() {
  const auth = useSelector((state) => state.firebase.auth);

  if (!isLoaded(auth)) {
    return null;
  }

  return (
    <Router>
      <Switch>
        <Route path='/admin' component={PrivateRoutes} />
        <Route path='/' component={PublicRoutes} />
      </Switch>
    </Router>
  );
}
