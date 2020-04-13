import React from 'react';

export function FormLabelRequired({ className }) {
  return <span className={`text-danger ${className || ''}`}>*</span>;
}
