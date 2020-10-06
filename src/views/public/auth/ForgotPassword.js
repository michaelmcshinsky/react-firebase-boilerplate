import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Container, Row, Col, Form, FormGroup, Label, Input, Button, Alert,
} from 'reactstrap';
import { useFirebase } from 'react-redux-firebase';

const MESSAGE = {
  text: '',
  type: null,
};

export function ForgotPassword () {
  const [state, setState] = useState({
    email: '',
    message: { ...MESSAGE },
    isSubmitting: false,
  });

  const firebase = useFirebase();

  function _handleChange (e) {
    e.persist();
    setState(prevState => ({ ...prevState, [e.target.name]: e.target.value }));
  }

  function _handleSubmit (e) {
    e.preventDefault();

    setState(prevState => ({ ...prevState, isSubmitting: true }));

    firebase
      .resetPassword(state.email)
      .then(() => {
        setState(prevState => ({
          ...prevState,
          isSubmitting: false,
          message: {
            text: 'A request has been submitting to the email provided.',
            type: 'info',
          },
        }));
      })
      .catch((err) => {
        setState(prevState => ({
          ...prevState,
          isSubmitting: false,
          message: {
            text: err.message,
            type: 'warning',
          },
        }));
      });
  }

  return (
    <div className="flex-fill d-flex w-100 align-items-center">
      <Container>
        <Row>
          <Col
            xs={{ size: 10, offset: 2 }}
            sm={{ size: 8, offset: 2 }}
            md={{ size: 6 }}
            lg={{ size: 4, offset: 4 }}
            className="mx-auto"
          >
            <h1 className="text-center">Forgot Password</h1>
            {state.message.type && <Alert color={ state.message.type }>{state.message.text}</Alert>}
            <Form onSubmit={ _handleSubmit }>
              <FormGroup>
                <Label for="loginEmail">Email</Label>
                <Input
                  type="email"
                  name="email"
                  id="loginEmail"
                  required
                  autoComplete="email"
                  placeholder="email@domain.com"
                  value={ state.email }
                  onChange={ _handleChange }
                />
              </FormGroup>
              <FormGroup>
                <Button
                  color="primary"
                  block
                  className="shadow"
                >
                  {state.isSubmitting && <i className="las la-spinner la-spin"></i>}
                  Submit
                </Button>
              </FormGroup>
              <FormGroup className="d-flex justify-content-between">
                <Link to="/login">
                  <i className="las la-arrow-left"></i>
                  {' '}
                  Back to Login
                </Link>
              </FormGroup>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
