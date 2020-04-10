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
  Alert
} from 'reactstrap';

export default function Contact() {
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  function onSubmit(e) {
    e.preventDefault();

    setIsSubmitted(!isSubmitted);
  }

  return (
    <Container className='py-4'>
      <Row>
        <Col md={{ size: 8, offset: 2 }}>
          <h1>Contact</h1>
          <Form onSubmit={onSubmit}>
            <FormGroup>
              <Label for='contactEmail'>Email</Label>
              <Input
                type='email'
                name='email'
                id='contactEmail'
                placeholder='email@domain.com'
              />
            </FormGroup>
            <FormGroup>
              <Label for='contactName'>Name</Label>
              <Input type='text' name='name' id='contactName' />
            </FormGroup>
            <FormGroup>
              <Label for='contactSubject'>Subject</Label>
              <Input type='text' name='subject' id='contactSubject' />
            </FormGroup>
            <FormGroup>
              <Label for='contactText'>Text Area</Label>
              <Input type='textarea' name='text' rows='5' id='contactText' />
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
