import React from 'react';
import PropTypes from 'prop-types';

export function PageTitle ({ children, className }) {
  if (!children) {
    return null;
  }

  return <h1 className={ `app-page-title mb-0 ${className || ''}` }>{children}</h1>;
}

PageTitle.propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.array, PropTypes.func]),
};
