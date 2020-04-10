import React from 'react';
import { Route } from 'react-router-dom';

export function PublicRoute({ component: Component, restricted, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        <Component {...props} />
        // auth.user && restricted ? (
        //   <Redirect to='/admin' />
        // ) : (
        // )
      }
    />
  );
}
