import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  Container, Row, Col, Form, FormGroup, Label, Input, Button, InputGroup, InputGroupAddon, InputGroupText, Alert,
} from 'reactstrap';
import { useFirebase } from 'react-redux-firebase';

import { Validation } from '@/components';

const VALIDATIONS = {
  minLength: false,
  oneLower: false,
  oneUpper: false,
  oneNumber: false,
  oneSpecial: false,
};
const MIN_LENGTH = 8;
const MESSAGE = {
  text: '',
  type: null,
};

export default function Register () {
  const [state, setState] = useState({
    email: '',
    password: '',
    passwordVisible: false,
    confirmPassword: '',
    confirmPasswordVisible: false,
    passwordValidations: VALIDATIONS,
    message: MESSAGE,
    isSubmitting: false,
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [message, setMessage] = useState({ ...MESSAGE });

  const firebase = useFirebase();
  const auth = firebase.auth();

  function _handleChange (e) {
    e.persist();
    if (e.target.name === 'password') {
      _validatePassword(e.target.value);
    }
    setMessage({ ...MESSAGE });
    setState(prevState => ({ ...prevState, [e.target.name]: e.target.value }));
  }

  function _validatePassword (value) {
    let validations = { ...state.passwordValidations };

    validations.minLength = !(value.length < MIN_LENGTH);
    validations.oneLower = !!/[a-z]/.test(value);
    validations.oneUpper = !!/[A-Z]/.test(value);
    validations.oneNumber = !!/[0-9]/.test(value);
    validations.oneSpecial = !!/[!@#$%^&*()_+]/.test(value);

    setState(prevState => ({ ...prevState, passwordValidations: validations }));
  }

  function _togglePassword () {
    setPasswordVisible(!passwordVisible);
  }

  function _togglePasswordConfirm () {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  }

  function _handleSubmit (e) {
    e.preventDefault();
    setState(prevState => ({ ...prevState, isSubmitting: true }));

    let valid = true;

    Object.keys(state.passwordValidations).forEach((key) => {
      if (state.passwordValidations[key] === false) {
        valid = false;
      }
    });

    if (!valid) {
      setState(prevState => ({
        ...prevState,
        message: {
          text: 'Missing required fields.',
          type: 'info',
        },
        isSubmitting: false,
      }));
      return;
    }

    firebase
      .createUser({ email: state.email, password: state.password })
      .then(() => {
        setState(prevState => ({
          ...prevState,
          email: '',
          password: '',
          confirmPassword: '',
          message: {
            text: 'Success! An email has been sent to you for verification.',
            type: 'info',
          },
          isSubmitting: false,
        }));
      })
      .then(() => {
        setState(prevState => ({
          ...prevState,
          isSubmitting: false,
        }));

        setTimeout(() => {
          return auth.currentUser.sendEmailVerification({
            url: process.env.REACT_APP_CONFIRMATION_EMAIL_REDIRECT,
          });
        }, 1000);
      })
      .catch((err) => {
        setState(prevState => ({
          ...prevState,
          message: {
            text: err.message,
            type: 'warning',
          },
          isSubmitting: false,
        }));
      });
  }

  let confirmValid = state.password !== state.confirmPassword && state.confirmPassword.length > 0 && state.password.length > 0;

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
            <h1 className="text-center">Register</h1>
            {message.type && <Alert color={ message.type }>{message.text}</Alert>}
            <Form onSubmit={ _handleSubmit }>
              <FormGroup>
                <Label for="loginEmail">Email</Label>
                <Input
                  type="email"
                  name="email"
                  id="loginEmail"
                  required
                  placeholder="email@domain.com"
                  value={ state.email }
                  onChange={ _handleChange }
                />
              </FormGroup>
              <FormGroup>
                <Label for="loginPassword">Password</Label>
                <InputGroup>
                  <Input
                    type={ passwordVisible ? 'text' : 'password' }
                    name="password"
                    id="loginPassword"
                    required
                    value={ state.password }
                    onChange={ _handleChange }
                  />
                  <InputGroupAddon
                    addonType="prepend"
                    onClick={ _togglePassword }
                  >
                    <InputGroupText>
                      <i className={ `lar la-eye${passwordVisible ? '' : '-slash'}` }></i>
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
                {state.password && (
                  <>
                    <Validation
                      valid={ state.passwordValidations.minLength }
                      message="Minimum of 8 characters"
                    />
                    <Validation
                      valid={ state.passwordValidations.oneLower }
                      message="At least one lowercase letter [a-z]"
                    />
                    <Validation
                      valid={ state.passwordValidations.oneUpper }
                      message="At least one uppercase letter [A-Z]"
                    />
                    <Validation
                      valid={ state.passwordValidations.oneNumber }
                      message="At least one number [0-9]"
                    />
                    <Validation
                      valid={ state.passwordValidations.oneSpecial }
                      message="At least one special character [!'#$%&\'()*+,-./:;<=>?@\\^`{|}~]'"
                    />
                  </>
                )}
              </FormGroup>
              <FormGroup>
                <Label for="loginConfirmPassword">Confirm Password</Label>
                <InputGroup>
                  <Input
                    type={ confirmPasswordVisible ? 'text' : 'password' }
                    name="confirmPassword"
                    id="loginConfirmPassword"
                    required
                    value={ state.confirmPassword }
                    onChange={ _handleChange }
                    invalid={ confirmValid }
                  />
                  <InputGroupAddon
                    addonType="prepend"
                    onClick={ _togglePasswordConfirm }
                  >
                    <InputGroupText>
                      <i className={ `lar la-eye${confirmPasswordVisible ? '' : '-slash'}` }></i>
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
                {confirmValid && (
                <Validation
                  valid={ !confirmValid }
                  message="Passwords do not match"
                />
                )}
              </FormGroup>
              <FormGroup>
                <Button
                  color="primary"
                  block
                  className="shadow"
                  disabled={ state.isSubmitting }
                >
                  {state.isSubmitting && <i className="las la-spinner la-spin"></i>}
                  {' '}
                  Register
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

Register.propTypes = {
  valid: PropTypes.bool,
  message: PropTypes.string,
};
