import React from 'react';
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Alert,
} from 'reactstrap';
import { FormLabelRequired } from '@components';

export default function Contact() {
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [name, setName] = React.useState('');
  const [subject, setSubject] = React.useState('');
  const [comment, setComment] = React.useState('');

  function onSubmit(e) {
    e.preventDefault();

    setIsSubmitted(!isSubmitted);
  }

  return (
    <Container className='py-5'>
      <Row>
        <Col md={{ size: 8, offset: 2 }}>
          <h1>Contact (Example)</h1>
          <Form onSubmit={onSubmit}>
            <FormGroup>
              <Label for='contactEmail'>
                Email <FormLabelRequired />
              </Label>
              <Input
                type='email'
                name='email'
                id='contactEmail'
                placeholder='email@domain.com'
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label for='contactName'>
                Name <FormLabelRequired />
              </Label>
              <Input
                type='text'
                name='name'
                id='contactName'
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label for='contactSubject'>
                Subject <FormLabelRequired />
              </Label>
              <Input
                type='text'
                name='subject'
                id='contactSubject'
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label for='contactText'>
                Comment <FormLabelRequired />
              </Label>
              <Input
                type='textarea'
                name='text'
                rows='5'
                id='contactText'
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </FormGroup>
            <Button color='primary'>Submit</Button>
            {isSubmitted && (
              <Alert className='mt-3' color='success'>
                Success! Your message has been sent.
              </Alert>
            )}
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
