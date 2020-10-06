import React from 'react';
import PropTypes from 'prop-types';
import {
  Form, FormGroup, Label, Input, Modal, ModalHeader, ModalBody, ModalFooter, Button,
} from 'reactstrap';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { useFirestore } from 'react-redux-firebase';
import { ProductModel } from '@/services/models';
import config from '../config';

export function ProductModal (props) {
  const [state, setState] = React.useState(new ProductModel(props.model));
  const firestore = useFirestore();
  const auth = useSelector(x => x.firebase.auth);

  function _handleChange (e) {
    e.persist();
    setState(prevState => ({ ...prevState, [e.target.name]: e.target.value }));
  }

  async function submitForm (e) {
    e.preventDefault();

    const api = firestore.collection(config.collection);

    if (state.id) {
      let submission = {
        ...state,
        updatedAt: moment().format(),
      };
      await api
        .doc(state.id)
        .update({ ...submission })
        .then(() => {
          props.handleSave(submission, true);
        });
    } else {
      let submission = {
        ...state,
        userID: auth.uid,
        createdAt: moment().format(),
        updatedAt: moment().format(),
      };

      await api.add({ ...submission }).then((doc_ref) => {
        submission.id = doc_ref.id;
        props.handleSave(submission, true);
      });
    }

    props.toggle();
  }

  let title = state?.id ? `Edit ${config.title}` : `Add ${config.title}`;

  return (
    <Modal
      isOpen={ props.isOpen }
      centered
    >
      {props.isOpen && (
        <Form onSubmit={ submitForm }>
          <ModalHeader toggle={ props.toggle }>{title}</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for={ `${config.dataSingle}ModalName` }>Name</Label>
              <Input
                id={ `${config.dataSingle}ModalName` }
                type="text"
                name="name"
                value={ state.name }
                onChange={ _handleChange }
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for={ `${config.dataSingle}ModalDescription` }>Description</Label>
              <Input
                id={ `${config.dataSingle}ModalDescription` }
                type="textarea"
                name="description"
                value={ state.description }
                onChange={ _handleChange }
                rows="3"
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button
              outline
              color="secondary"
              type="button"
              onClick={ props.toggle }
            >
              Cancel
            </Button>
            <Button
              color="primary"
              type="submit"
            >
              Submit
            </Button>
          </ModalFooter>
        </Form>
      )}
    </Modal>
  );
}

ProductModal.propTypes = {
  model: PropTypes.object,
  handleSave: PropTypes.func,
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
};
