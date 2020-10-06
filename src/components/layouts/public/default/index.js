import React from 'react';
import PropTypes from 'prop-types';
import Navigation from './components/navigation';
import Footer from './components/footer';

export function PublicDefaultLayout ({ children }) {
  return (
    <>
      <header>
        <Navigation />
      </header>
      <main
        id="content"
        className="flex-fill d-flex flex-column"
      >
        {children}
      </main>
      <Footer />
    </>
  );
}

PublicDefaultLayout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.array, PropTypes.func]),
};
