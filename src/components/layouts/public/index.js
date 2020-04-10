import React from 'react';
import Navigation from './components/navigation';
import Footer from './components/footer';

export default function PublicLayout(props) {
  return (
    <>
      <header>
        <Navigation />
      </header>
      <main id='content' className='flex-fill d-flex flex-column'>
        {props.children}
      </main>
      <Footer />
    </>
  );
}
