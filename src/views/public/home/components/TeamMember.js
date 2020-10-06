import React from 'react';
import PropTypes from 'prop-types';

export function TeamMember ({ src, title }) {
  return (
    <div className="my-5">
      <img
        className="rounded-circle"
        src={ src }
        alt="team member"
      />
      <p className="lead mt-4">{title}</p>
    </div>
  );
}

TeamMember.propTypes = {
  src: PropTypes.string,
  title: PropTypes.string,
};
