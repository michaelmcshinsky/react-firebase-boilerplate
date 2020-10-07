import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useFirestore } from 'react-redux-firebase';
import {
  Container, Row, Col, Button, Form, FormGroup, Label, Input,
} from 'reactstrap';
import moment from 'moment';
import { PageLayout, PageTitle } from '@/components';

import { UserModel } from '@/services/models';

export default function Account () {
  const [state, setState] = useState(new UserModel());
  const firestore = useFirestore();
  const auth = useSelector(x => x.firebase.auth);
  const api = firestore.collection('users');

  React.useEffect(() => {
    _getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log('state', state)

  function _getUser () {
    let appUser = JSON.parse(localStorage.getItem('appUser'));
    if (appUser) {
      setState(appUser);
    } else {
      api
        .doc(auth.uid)
        .get()
        .then((doc) => {
          let user = { uid: doc.id, ...doc.data() };

          setState(user);
          _updateStorage(user);
        });
    }
  }

  function _handleChange (e) {
    setState(prevState => ({ ...prevState, [e.target.name]: e.target.value }));
  }

  function _updateStorage (obj) {
    localStorage.setItem('appUser', JSON.stringify(obj));
  }

  function save (e) {
    e.preventDefault();
    api.doc(auth.uid).update({ ...state });
  }

  const lastLoginAtParsed = moment(Date(auth?.lastLoginAt)).format();

  return (
    <PageLayout>
      <div className="d-flex flex-column">
        <PageTitle className="mb-4">Account</PageTitle>
        <Container className="ml-0 p-0">
          <Row>
            <Col
              md="6"
              lg="4"
            >
              <h2 className="text-xl mb-4">General</h2>
              <Form onSubmit={ save }>
                <FormGroup>
                  <Label for="viewAccountFirstName">First Name</Label>
                  <Input
                    id="viewAccountFirstName"
                    type="text"
                    name="firstName"
                    value={ state.firstName }
                    onChange={ _handleChange }
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="viewAccountLastName">Last Name</Label>
                  <Input
                    id="viewAccountLastName"
                    type="text"
                    name="lastName"
                    value={ state.lastName }
                    onChange={ _handleChange }
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="viewAccountDisplayName">Display Name</Label>
                  <Input
                    id="viewAccountDisplayName"
                    type="text"
                    name="displayName"
                    value={ state.displayName }
                    onChange={ _handleChange }
                  />
                </FormGroup>
                <Button
                  type="submit"
                  color="primary"
                >
                  Save
                </Button>
              </Form>
            </Col>
            <Col
              md="6"
              lg="4"
            >
              <h2 className="text-xl mb-4">Additional</h2>
              <FormGroup>
                <Label for="viewAccountEmail">Email</Label>
                <Input
                  id="viewAccountEmail"
                  type="text"
                  name="email"
                  defaultValue={ state.email }
                  disabled
                />
              </FormGroup>
              <FormGroup>
                <Label>Email Verified?</Label>
                <Input
                  type="text"
                  name="emailVerified"
                  defaultValue={ auth.emailVerified ? 'Yes' : 'No, please check your email.' }
                  disabled
                />
              </FormGroup>
              <FormGroup>
                <Label>Last Login / Accessed</Label>
                <Input
                  type="text"
                  name="lastLoginAt"
                  defaultValue={ lastLoginAtParsed }
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
