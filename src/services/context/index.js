import React from 'react';
// import { AuthProvider } from './auth';
// import { FirebaseProvider } from './firebase';
import { ThemeProvider } from './theme';

export default function AppProviders({ children }) {
  return (
    // <FirebaseProvider>
      // <AuthProvider>
          <ThemeProvider>{children}</ThemeProvider>
      // </AuthProvider>
    // </FirebaseProvider>
  );
}
