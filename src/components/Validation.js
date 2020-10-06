import React from 'react';
import PropTypes from 'prop-types';
import { FormText } from 'reactstrap';

export function Validation ({ valid, message }) {
  let type = valid ? 'check text-success' : 'times text-danger';
  return (
    <FormText>
      <i className={ `pr-1 las la-${type}` }></i>
      {message}
    </FormText>
  );
}

Validation.propTypes = {
  valid: PropTypes.bool,
  message: PropTypes.string,
};
