import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  Container, Row, Col, Form, FormGroup, Label, Input, Button, Alert,
} from 'reactstrap';
import { useFirebase } from 'react-redux-firebase';

const MESSAGE = {
  text: '',
  type: null,
};

export default function Login (props) {
  const [state, setState] = useState({
    email: '',
    password: '',
    message: { ...MESSAGE },
    isSubmitting: false,
  });

  const firebase = useFirebase();

  function _handleChange (e) {
    e.persist();
    setState(prevState => ({ ...prevState, message: { ...MESSAGE }, [e.target.name]: e.target.value }));
  }

  function handleSubmit (e) {
    e.preventDefault();

    setState(prevState => ({
      ...prevState,
      isSubmitting: true,
    }));

    firebase
      .login({ email: state.email, password: state.password })
      .then(() => {
        setState(prevState => ({
          ...prevState,
          email: '',
          password: '',
          isSubmitting: false,
        }));

        setTimeout(() => {
          props.history.push('/admin');
        });
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
            <h1 className="text-center">Login</h1>
            {state.message.type && <Alert color={ state.message.type }>{state.message.text}</Alert>}
            <Form onSubmit={ handleSubmit }>
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
                <Label for="loginPassword">Password</Label>
                <Input
                  type="password"
                  name="password"
                  id="loginPassword"
                  required
                  autoComplete="password"
                  value={ state.password }
                  onChange={ _handleChange }
                />
              </FormGroup>
              <FormGroup>
                <Button
                  color="primary"
                  block
                  className="shadow"
                  disabled={ state.isSubmitting }
                >
                  {state.isSubmitting && <i className="las la-spinner la-spin"></i>}
                  Login
                </Button>
              </FormGroup>
              <FormGroup className="d-flex justify-content-between">
                <Link to="/register">Register</Link>
                <Link to="/forgot-password">Forgot Password</Link>
              </FormGroup>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

Login.propTypes = {
  history: PropTypes.object,
};
