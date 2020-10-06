import React from 'react';
import PropTypes from 'prop-types';

const ThemeContext = React.createContext();

export function ThemeProvider ({ children }) {
  const [theme, setTheme] = React.useState(null);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

function useTheme () {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export { useTheme, ThemeContext };

ThemeProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};
