import React from 'react';
import { Container, Row, Col } from 'reactstrap';

export default function NotFound() {
  return (
    <Container className="py-4">
      <Row>
        <Col sm='12'>
          <h1>Not Found</h1>
        </Col>
      </Row>
    </Container>
  );
}
