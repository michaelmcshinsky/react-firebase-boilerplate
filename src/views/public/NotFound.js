import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';

export default function NotFound () {
  return (
    <Container
      className="py-4"
      id="page-notFound"
    >
      <Row>
        <Col
          sm="12"
          className="text-center"
        >
          <h1 className="text-primary">404</h1>
          <h2 className="text-primary">Page Not Found</h2>
          <p>Sorry, we couldn't find the page you are looking for.</p>
          <Link
            to="/"
            className="btn btn-primary"
          >
            Go to Home Page
          </Link>
        </Col>
      </Row>
    </Container>
  );
}
