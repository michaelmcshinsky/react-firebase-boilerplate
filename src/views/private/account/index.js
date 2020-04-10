import React from 'react';
import { useSelector } from 'react-redux';
import { useFirestore } from 'react-redux-firebase';
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input
} from 'reactstrap';
import moment from 'moment';
import { PageLayout, PageTitle } from '@components';

import { UserModel } from '@services/models';

const reducer = (state = {}, action) => {
  switch (action.type) {
    case 'handleChange': {
      let obj = { ...state, [action.name]: action.value };
      localStorage.setItem('appUser', JSON.stringify(obj));
      return obj;
    }
    case 'set': {
      let obj = { ...state, ...action.payload };
      localStorage.setItem('appUser', JSON.stringify(obj));
      return obj;
    }
    default:
      throw new Error('Unexpected action');
  }
};

export default function Account() {
  const [user, dispatch] = React.useReducer(reducer, new UserModel());
  const firestore = useFirestore();
  const auth = useSelector(state => state.firebase.auth);
  const api = firestore.collection('users');

  React.useEffect(() => {
    _getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function _getUser() {
    let appUser = JSON.parse(localStorage.getItem('appUser'));
    if (appUser) {
      dispatch({ type: 'set', payload: appUser });
    } else {
      api
        .doc(auth.uid)
        .get()
        .then(doc => {
          dispatch({ type: 'set', payload: { id: doc.id, ...doc.data() } });
        });
    }
  }

  function handleChange(e) {
    dispatch({
      type: 'handleChange',
      name: e.target.name,
      value: e.target.value
    });
  }

  function save(e) {
    e.preventDefault();
    api
      .doc(auth.uid)
      .update(Object.assign({}, user))
      .then(res => {
        console.log('res', res);
      });
  }

  console.log('auth', auth);

  return (
    <PageLayout>
      <div className='d-flex flex-column'>
        <PageTitle className='mb-4'>Account</PageTitle>
        <Container className='ml-0 p-0'>
          <Row>
            <Col md='6' lg='4'>
              <h2 className='text-xl mb-4'>General</h2>
              <Form onSubmit={save}>
                <FormGroup>
                  <Label for='viewAccountFirstName'>First Name</Label>
                  <Input
                    id='viewAccountFirstName'
                    type='text'
                    name='firstName'
                    value={user.firstName}
                    onChange={handleChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for='viewAccountLastName'>Last Name</Label>
                  <Input
                    id='viewAccountFirstName'
                    type='text'
                    name='lastName'
                    value={user.lastName}
                    onChange={handleChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for='viewAccountDisplayName'>Display Name</Label>
                  <Input
                    id='viewAccountDisplayName'
                    type='text'
                    name='displayName'
                    value={user.displayName}
                    onChange={handleChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for='viewAccountEmail'>Email</Label>
                  <Input
                    id='viewAccountEmail'
                    type='text'
                    name='email'
                    defaultValue={user.email}
                    disabled
                  />
                </FormGroup>
                <Button type='submit' color='primary'>
                  Save
                </Button>
              </Form>
            </Col>
            <Col md='6' lg='4'>
              <h2 className='text-xl mb-4'>Advanced</h2>
              <FormGroup>
                <Label>Email Verified</Label>
                <Input
                  type='text'
                  name='emailVerified'
                  defaultValue={
                    auth.emailVerified ? 'Yes' : 'No, please check your email.'
                  }
                  disabled
                />
              </FormGroup>
              <FormGroup>
                <Label>Created At</Label>
                <Input
                  type='text'
                  name='createdAt'
                  defaultValue={moment(Date(auth.createdAt)).format('LLLL')}
                  disabled
                />
              </FormGroup>
              <FormGroup>
                <Label>Last Login</Label>
                <Input
                  type='text'
                  name='lastLoginAt'
                  defaultValue={moment(Date(auth.lastLoginAt)).format('LLLL')}
                  disabled
                />
              </FormGroup>
            </Col>
          </Row>
        </Container>
      </div>
    </PageLayout>
  );
}
