import React from 'react';
import {
  Container, Row, Col, FormGroup, Input, Button,
} from 'reactstrap';

export function Newsletter () {
  const [email, setEmail] = React.useState('');

  function onSubmit (e) {
    e.preventDefault();
  }

  return (
    <Container>
      <Row>
        <Col
          lg={{ size: 6 }}
          md={{ size: 9 }}
          className="mx-auto"
        >
          <h1 className="mb-4 text-center">Sign up and learn more!</h1>
          <form onSubmit={ onSubmit }>
            <Row className="form-row">
              <Col md="9">
                <FormGroup>
                  <Input
                    type="text"
                    name="email"
                    value={ email }
                    placeholder="Enter your email..."
                    onChange={ e => setEmail(e.target.value) }
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Button
                    type="submit"
                    color="primary"
                    block
                  >
                    Sign up!
                  </Button>
                </FormGroup>
              </Col>
            </Row>
          </form>
        </Col>
      </Row>
    </Container>
  );
}
