import React from 'react';
import { Provider } from 'react-redux';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';
import { createStore, combineReducers } from 'redux';
import {
  ReactReduxFirebaseProvider,
  firebaseReducer,
} from 'react-redux-firebase';
import { createFirestoreInstance, firestoreReducer } from 'redux-firestore';

import { fbConfig } from '@config';

export function FirebaseProvider({ children }) {
  const rrfConfig = {
    userProfile: 'users',
    useFirestoreForProfile: true,
    enableClaims: true,
  };

  firebase.initializeApp(fbConfig);

  firebase.firestore();
  firebase.functions();

  const rootReducer = combineReducers({
    firebase: firebaseReducer,
    firestore: firestoreReducer,
  });

  const initialState = {};
  const store = createStore(rootReducer, initialState);

  const rrfProps = {
    firebase,
    config: rrfConfig,
    dispatch: store.dispatch,
    createFirestoreInstance,
  };

  return (
    <Provider store={store}>
      <ReactReduxFirebaseProvider {...rrfProps}>
        {children}
      </ReactReduxFirebaseProvider>
    </Provider>
  );
}
