import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Table, Button } from 'reactstrap';
import moment from 'moment';
import { Confirm, PageLayout, PageTitle } from '@/components';
import { confirmAlert } from 'react-confirm-alert';
import { useFirestore } from 'react-redux-firebase';
import { UserModal } from './components';
import config from './config';

export default function Users () {
  const [state, setState] = useState({
    collection: [],
    activeModel: null,
    isModalOpen: false,
  });
  const firestore = useFirestore();

  React.useEffect(() => {
    getCollection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function getCollection () {
    firestore
      .collection(config.collection)
      .get()
      .then((queryShapshot) => {
        parseData(queryShapshot.docs);
      });
  }

  function parseData (docs) {
    let arr = docs.map((doc) => {
      let model = doc.data();
      model.id = doc.id;
      model.createdAt = moment(model.createdAt).format('LLL');
      model.updatedAt = moment(model.updatedAt).format('LLL');
      return model;
    });
    arr.sort((a, b) => (a.displayName > b.displayName ? 1 : -1));
    setState(prevState => ({ ...prevState, collection: arr }));
  }

  function deleteModel (model, index) {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <Confirm
            isOpen
            title={ `Delete ${config.title}` }
            content="Are you sure you want to delete this?"
            cancel={ onClose }
            confirm={ (e) => {
              deleteFromFirebase(model, index);
              onClose(e);
            } }
          />
        );
      },
    });
  }

  function deleteFromFirebase (model, index) {
    firestore
      .collection(config.collection)
      .doc(model.id)
      .delete()
      .then(() => {
        let arr = [...state.collection];
        arr.splice(index, 1);
        setState(prevState => ({ ...prevState, collection: arr }));
      });
  }

  function toggleModal (model = null) {
    setState(prevState => ({ ...prevState, activeModel: model, isModalOpen: !state.isModalOpen }));
  }

  function handleSave (model, isNew) {
    if (isNew) {
      getCollection();
    } else {
      let arr = [...state.collection];
      let index = arr.findIndex(x => x.id === model.id);
      if (index > -1) {
        arr[index] = model;
      }
      setState(prevState => ({ ...prevState, collection: arr }));
    }
  }

  console.log('state', state.collection);

  return (
    <>
      <PageLayout>
        <div className="d-flex mb-3">
          <PageTitle>{config.titlePlural}</PageTitle>
        </div>
        <Table>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Display Name</th>
              <th>Email</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {state.collection.map((model, index) => (
              <tr key={ index }>
                <td>{model.firstName}</td>
                <td>{model.lastName}</td>
                <td>{model.displayName}</td>
                <td>{model.email}</td>
                <td>{model.createdAt}</td>
                <td>{model.updatedAt}</td>
                <td
                  width="110"
                  className="text-center"
                >
                  <Button
                    size="md"
                    color="secondary"
                    type="button"
                    onClick={ () => toggleModal(model) }
                  >
                    <i className="las la-edit"></i>
                  </Button>
                  <Button
                    size="md"
                    color="danger"
                    type="button"
                    className="ml-2"
                    onClick={ () => deleteModel(model, index) }
                  >
                    <i className="las la-trash"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </PageLayout>
      {state.isModalOpen && (
      <UserModal
        model={ state.activeModel }
        isOpen={ state.isModalOpen }
        toggle={ toggleModal }
        handleSave={ handleSave }
      />
      )}
    </>
  );
}

Users.propTypes = {
  onClose: PropTypes.func,
};
