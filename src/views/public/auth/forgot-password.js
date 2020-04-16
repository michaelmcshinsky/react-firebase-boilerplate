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

export function ForgotPassword() {
  const [email, setEmail] = React.useState('');
  const [message, setMessage] = React.useState({ ...MESSAGE });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const firebase = useFirebase();

  function handleSubmit(e) {
    e.preventDefault();

    setIsSubmitting(true);

    firebase
      .resetPassword(email)
      .then((res) => {
        setMessage({
          text: 'A request has been submitting to the email provided.',
          type: 'info',
        });

        setIsSubmitting(false);
      })
      .catch((err) => {
        setMessage({
          text: err.message,
          type: 'warning',
        });

        setIsSubmitting(false);
      });
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
            <h1 className='text-center'>Forgot Password</h1>
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
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <Button color='primary' block className='shadow'>
                  {isSubmitting && <i className='las la-spinner la-spin'></i>}
                  Submit
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
