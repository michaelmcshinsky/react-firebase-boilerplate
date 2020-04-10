import React from 'react';

export function PageTitle({ children, className }) {
  if (!children) {
    return null;
  }

  return <h1 className={`app-page-title mb-0 ${className || ''}`}>{children}</h1>;
}
