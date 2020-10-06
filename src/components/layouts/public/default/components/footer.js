import React from 'react';
import { Container } from 'reactstrap';

export default function Footer () {
  return (
    <footer className="py-5 bg-dark">
      <Container>
        <p className="m-0 text-center text-white">
          React Firebase Boilerplate &copy; Your Website
          {new Date().getFullYear()}
        </p>
      </Container>
    </footer>
  );
}
