import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';

export default function NotFound() {
  return (
    <Container className='py-4'>
      <Row>
        <Col sm='12' className='text-center'>
          <h1
            className='text-primary'
            style={{ fontSize: '8rem', fontWeight: '700' }}
          >
            404
          </h1>
          <h2
            className='text-primary'
            style={{ fontWeight: '700', fontSize: '2.25rem' }}
          >
            Page Not Found
          </h2>
          <p style={{ fontWeight: '600' }}>
            Sorry, we couldn't find the page you are looking for.
          </p>
          <Link to='/' className='btn btn-primary'>
            Go to Home Page
          </Link>
        </Col>
      </Row>
    </Container>
  );
}
