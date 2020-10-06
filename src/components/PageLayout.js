import React from 'react';
import PropTypes from 'prop-types';

export function PageLayout ({ children }) {
  if (!children) {
    return null;
  }

  return <div className="app-page-layout m-3 p-3 bg-white rounded border">{children}</div>;
}

PageLayout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.array, PropTypes.func]),
};
