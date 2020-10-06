import React, { useState } from 'react';
import {
  Container, Row, Col, Button, Form, FormGroup, Label, Input, Alert,
} from 'reactstrap';
import { FormLabelRequired } from '@/components';

export default function Contact () {
  const [state, setState] = useState({
    isSubmitted: false,
    email: '',
    name: '',
    subject: '',
    comment: '',
  });

  function _handleChange (e) {
    e.persist();
    setState(prevState => ({ ...prevState, [e.target.name]: e.target.value }));
  }

  function onSubmit (e) {
    e.preventDefault();
    setState(prevState => ({ ...prevState, isSubmitted: !prevState.isSubmitted }));
  }

  return (
    <Container className="py-5">
      <Row>
        <Col md={{ size: 8, offset: 2 }}>
          <h1>Contact (Example)</h1>
          <Form onSubmit={ onSubmit }>
            <FormGroup>
              <Label for="contactEmail">
                Email
                <FormLabelRequired />
              </Label>
              <Input
                type="email"
                name="email"
                id="contactEmail"
                placeholder="email@domain.com"
                required
                value={ state.email }
                onChange={ _handleChange }
              />
            </FormGroup>
            <FormGroup>
              <Label for="contactName">
                Name
                <FormLabelRequired />
              </Label>
              <Input
                type="text"
                name="name"
                id="contactName"
                required
                value={ state.name }
                onChange={ _handleChange }
              />
            </FormGroup>
            <FormGroup>
              <Label for="contactSubject">
                Subject
                <FormLabelRequired />
              </Label>
              <Input
                type="text"
                name="subject"
                id="contactSubject"
                required
                value={ state.subject }
                onChange={ _handleChange }
              />
            </FormGroup>
            <FormGroup>
              <Label for="contactText">
                Comment
                <FormLabelRequired />
              </Label>
              <Input
                type="textarea"
                name="text"
                rows="5"
                id="contactText"
                required
                value={ state.comment }
                onChange={ _handleChange }
              />
            </FormGroup>
            <Button color="primary">Submit</Button>
            {state.isSubmitted && (
              <Alert
                className="mt-3"
                color="success"
              >
                Success! Your message has been sent.
              </Alert>
            )}
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
