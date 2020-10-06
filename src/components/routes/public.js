import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';

export function PublicRoute ({ component: Component, restricted, ...rest }) {
  return (
    <Route
      { ...rest }
      render={ props => <Component { ...props } /> }
    />
  );
}

PublicRoute.propTypes = {
  restricted: PropTypes.bool,
  component: PropTypes.oneOfType([PropTypes.node, PropTypes.array, PropTypes.func]),
};
