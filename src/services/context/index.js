import React from 'react';
import PropTypes from 'prop-types';
import { FirebaseProvider } from './firebase';
import { ThemeProvider } from './theme';

export function AppProviders ({ children }) {
  return (
    <FirebaseProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </FirebaseProvider>
  );
}

AppProviders.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};
