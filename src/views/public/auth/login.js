import React from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Alert,
} from 'reactstrap';
import { useFirebase } from 'react-redux-firebase';

const MESSAGE = {
  text: '',
  type: null,
};

export function Login(props) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [message, setMessage] = React.useState({ ...MESSAGE });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const firebase = useFirebase();

  function handleEmail(value) {
    setMessage({ ...MESSAGE });
    setEmail(value);
  }

  function handlePassword(value) {
    setMessage({ ...MESSAGE });
    setPassword(value);
  }

  function handleSubmit(e) {
    e.preventDefault();

    firebase
      .login({ email, password })
      .then(() => {
        setIsSubmitting(false);
        setEmail('');
        setPassword('');
        setTimeout(() => {
          props.history.push('/admin');
        });
      })
      .catch((err) => {
        setMessage({
          text: err.message,
          type: 'warning',
        });

        setIsSubmitting(false);
      });

    setIsSubmitting(true);
  }

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
            <h1 className='text-center'>Login</h1>
            {message.type && <Alert color={message.type}>{message.text}</Alert>}
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label for='loginEmail'>Email</Label>
                <Input
                  type='email'
                  name='email'
                  id='loginEmail'
                  required
                  autoComplete='email'
                  placeholder='email@domain.com'
                  value={email}
                  onChange={(e) => handleEmail(e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <Label for='loginPassword'>Password</Label>
                <Input
                  type='password'
                  name='password'
                  id='loginPassword'
                  required
                  autoComplete='password'
                  value={password}
                  onChange={(e) => handlePassword(e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <Button
                  color='primary'
                  block
                  className='shadow'
                  disabled={isSubmitting}
                >
                  {isSubmitting && <i className='las la-spinner la-spin'></i>}
                  Login
                </Button>
              </FormGroup>
              <FormGroup className='d-flex justify-content-between'>
                <Link to='/register'>Register</Link>
                <Link to='/forgot-password'>Forgot Password</Link>
              </FormGroup>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
