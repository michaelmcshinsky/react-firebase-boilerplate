import React from 'react';

export function WelcomeLead({ icon, title, body }) {
  return (
    <div className='text-center'>
      <div className='features-icon d-flex'>
        <i className={`las la-${icon || ''} m-auto text-primary`}></i>
      </div>
      <h4>{title}</h4>
      <p className='lead mb-0'>{body}</p>
    </div>
  );
}
