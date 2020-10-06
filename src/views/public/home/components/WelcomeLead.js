import React from 'react';
import PropTypes from 'prop-types';

export function WelcomeLead ({ icon, title, body }) {
  return (
    <div className="text-center">
      <div className="features-icon d-flex">
        <i className={ `las la-${icon || ''} m-auto text-primary` }></i>
      </div>
      <h4>{title}</h4>
      <p className="lead mb-0">{body}</p>
    </div>
  );
}

WelcomeLead.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string,
  body: PropTypes.string,
};
