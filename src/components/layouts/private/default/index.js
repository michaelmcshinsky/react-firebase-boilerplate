import React from 'react';
import PropTypes from 'prop-types';
import Header from './components/header';
import Sidebar from './components/sidebar';

export function PrivateDefaultLayout ({ children }) {
  const [isHidden, setIsHidden] = React.useState(false);

  return (
    <div
      id="app-container"
      className={ `d-flex bg-light${isHidden ? ' toggled' : ''}` }
    >
      <Sidebar />
      <div
        id="app-content"
        className="d-flex flex-column overflow-hidden"
      >
        <Header
          isHidden={ isHidden }
          toggle={ () => setIsHidden(!isHidden) }
        />
        <div className="flex-fill overflow-auto">{children}</div>
      </div>
    </div>
  );
}

PrivateDefaultLayout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.array, PropTypes.func]),
};
