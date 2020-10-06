import React from 'react';
import PropTypes from 'prop-types';

export function FormLabelRequired ({ className }) {
  return <span className={ `text-danger ${className || ''}` }>*</span>;
}

FormLabelRequired.propTypes = {
  className: PropTypes.string,
};
