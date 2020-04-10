import React from 'react';

export function PageLayout({ children }) {
  if (!children) {
    return null;
  }

  return (
    <div className='app-page-layout m-3 p-3 bg-white rounded border'>
      {children}
    </div>
  );
}
