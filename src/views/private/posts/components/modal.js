import React from 'react';
import PropTypes from 'prop-types';
import {
  Form, FormGroup, Label, Input, Modal, ModalHeader, ModalBody, ModalFooter, Button,
} from 'reactstrap';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { useFirestore } from 'react-redux-firebase';
import { PostModel } from '@/services/models';
import config from '../config';

export function PostModal (props) {
  const [state, setState] = React.useState(new PostModel(props.model));
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
      size="lg"
    >
      {props.isOpen && (
        <Form onSubmit={ submitForm }>
          <ModalHeader toggle={ props.toggle }>{title}</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for={ `${config.dataSingle}ModalTitle` }>Title</Label>
              <Input
                id={ `${config.dataSingle}ModalTitle` }
                type="text"
                name="title"
                value={ state.title }
                onChange={ _handleChange }
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for={ `${config.dataSingle}ModalSummary` }>Summary</Label>
              <Input
                id={ `${config.dataSingle}ModalSummary` }
                type="textarea"
                name="summary"
                value={ state.summary }
                onChange={ _handleChange }
                rows="3"
              />
            </FormGroup>
            <FormGroup>
              <Label for={ `${config.dataSingle}ModalBody` }>Body</Label>
              <Input
                id={ `${config.dataSingle}ModalBody` }
                type="textarea"
                name="body"
                value={ state.body }
                onChange={ _handleChange }
                rows="6"
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

PostModal.propTypes = {
  model: PropTypes.object,
  handleSave: PropTypes.func,
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
};
