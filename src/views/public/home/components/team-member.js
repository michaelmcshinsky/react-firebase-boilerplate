import React from 'react';

export function TeamMember({ src, title }) {
  return (
    <div className='my-5'>
      <img className='rounded-circle' src={src} alt='team member' />
      <p className='lead mt-4'>{title}</p>
    </div>
  );
}
