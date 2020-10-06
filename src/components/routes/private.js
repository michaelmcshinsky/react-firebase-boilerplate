import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { isEmpty } from 'react-redux-firebase';

export function PrivateRoute ({ component: Component, ...rest }) {
  const auth = useSelector(state => state.firebase.auth);

  return (
    <Route
      { ...rest }
      render={ props => (!isEmpty(auth) ? <Component { ...props } /> : <Redirect to="/login" />) }
    />
  );
}

PrivateRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.node, PropTypes.array, PropTypes.func]),
};
