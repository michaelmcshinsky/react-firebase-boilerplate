import React from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  FormText,
  Label,
  Input,
  Button,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Alert
} from 'reactstrap';
import { useFirebase } from 'react-redux-firebase';

const VALIDATIONS = {
  minLength: false,
  oneLower: false,
  oneUpper: false,
  oneNumber: false,
  oneSpecial: false
};
const MIN_LENGTH = 8;
const MESSAGE = {
  text: '',
  type: null
};

export function Register(props) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [confirmPasswordVisible, setConfirmPasswordVisible] = React.useState(
    false
  );
  const [passwordValidations, setPasswordValidations] = React.useState(
    VALIDATIONS
  );
  const [message, setMessage] = React.useState({ ...MESSAGE });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const firebase = useFirebase();
  const auth = firebase.auth();

  function handleEmail(value) {
    setMessage({ ...MESSAGE });
    setEmail(value);
  }

  function handleConfirmPassword(value) {
    setMessage({ ...MESSAGE });
    setConfirmPassword(value);
  }

  function handlePassword(value) {
    validatePassword(value);
    setMessage({ ...MESSAGE });
    setPassword(value);
  }

  function validatePassword(value) {
    let validations = { ...passwordValidations };

    validations.minLength = value.length < MIN_LENGTH ? false : true;
    validations.oneLower = !/[a-z]/.test(value) ? false : true;
    validations.oneUpper = !/[A-Z]/.test(value) ? false : true;
    validations.oneNumber = !/[0-9]/.test(value) ? false : true;
    validations.oneSpecial = !/[!@#$%^&*()_+]/.test(value) ? false : true;

    setPasswordValidations(validations);
  }

  function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);

    let valid = true;
    for (let key in passwordValidations) {
      if (passwordValidations[key] === false) {
        valid = false;
      }
    }

    if (!valid) {
      setMessage({
        text: 'Missing required fields.',
        type: 'info'
      });
      return;
    }

    firebase
      .createUser({ email, password })
      .then(user => {
        setMessage({
          text: 'Success! An email has been sent to you for verification.',
          type: 'info'
        });
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      })
      .then(res => {
        setIsSubmitting(false);
        setTimeout(() => {
          return auth.currentUser.sendEmailVerification({
            url: process.env.REACT_APP_CONFIRMATION_EMAIL_REDIRECT
          });
        }, 1000);
      })
      .catch(err => {
        setMessage({
          text: err.message,
          type: 'warning'
        });

        setIsSubmitting(false);
      });
  }

  let confirmValid =
    password !== confirmPassword &&
    confirmPassword.length > 0 &&
    password.length > 0;

  return (
    <div className='flex-fill d-flex w-100 align-items-center'>
      <Container>
        <Row>
          <Col
            xs={{ size: 10, offset: 2 }}
            sm={{ size: 8, offset: 2 }}
            md={{ size: 6 }}
            lg={{ size: 4, offset: 4 }}
            className='mx-auto'
          >
            <h1 className='text-center'>Register</h1>
            {message.type && <Alert color={message.type}>{message.text}</Alert>}
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label for='loginEmail'>Email</Label>
                <Input
                  type='email'
                  name='email'
                  id='loginEmail'
                  required
                  placeholder='email@domain.com'
                  value={email}
                  onChange={e => handleEmail(e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <Label for='loginPassword'>Password</Label>
                <InputGroup>
                  <Input
                    type={passwordVisible ? 'text' : 'password'}
                    name='password'
                    id='loginPassword'
                    required
                    value={password}
                    onChange={e => handlePassword(e.target.value)}
                  />
                  <InputGroupAddon
                    addonType='prepend'
                    onClick={() => setPasswordVisible(!passwordVisible)}
                  >
                    <InputGroupText>
                      <i
                        className={`lar la-eye${
                          passwordVisible ? '' : '-slash'
                        }`}
                      ></i>
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
                {password && (
                  <>
                    <ValidationRow
                      valid={passwordValidations.minLength}
                      message='Minimum of 8 characters'
                    />
                    <ValidationRow
                      valid={passwordValidations.oneLower}
                      message='At least one lowercase letter [a-z]'
                    />
                    <ValidationRow
                      valid={passwordValidations.oneUpper}
                      message='At least one uppercase letter [A-Z]'
                    />
                    <ValidationRow
                      valid={passwordValidations.oneNumber}
                      message='At least one number [0-9]'
                    />
                    <ValidationRow
                      valid={passwordValidations.oneSpecial}
                      message="At least one special character [!'#$%&\'()*+,-./:;<=>?@\\^`{|}~]'"
                    />
                  </>
                )}
              </FormGroup>
              <FormGroup>
                <Label for='loginConfirmPassword'>Confirm Password</Label>
                <InputGroup>
                  <Input
                    type={confirmPasswordVisible ? 'text' : 'password'}
                    name='password'
                    id='loginConfirmPassword'
                    required
                    value={confirmPassword}
                    onChange={e => handleConfirmPassword(e.target.value)}
                    invalid={confirmValid}
                  />
                  <InputGroupAddon
                    addonType='prepend'
                    onClick={() =>
                      setConfirmPasswordVisible(!confirmPasswordVisible)
                    }
                  >
                    <InputGroupText>
                      <i
                        className={`lar la-eye${
                          confirmPasswordVisible ? '' : '-slash'
                        }`}
                      ></i>
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
                {confirmValid && (
                  <ValidationRow
                    valid={!confirmValid}
                    message='Passwords do not match'
                  />
                )}
              </FormGroup>
              <FormGroup>
                <Button
                  color='primary'
                  block
                  className='shadow'
                  disabled={isSubmitting}
                >
                  {isSubmitting && <i className='las la-spinner la-spin'></i>}{' '}
                  Register
                </Button>
              </FormGroup>
              <FormGroup className='d-flex justify-content-between'>
                <Link to='/login'>
                  <i className='las la-arrow-left'></i> Back to Login
                </Link>
              </FormGroup>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

function ValidationRow({ valid, message }) {
  let type = valid ? 'check text-success' : 'times text-danger';
  return (
    <FormText>
      <i className={`pr-1 las la-${type}`}></i>
      {message}
    </FormText>
  );
}
