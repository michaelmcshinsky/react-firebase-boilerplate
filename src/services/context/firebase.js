import React from 'react';
import Firebase from '@constants/firebase';

const FirebaseContext = React.createContext();

export function FirebaseProvider({ children }) {
  const [firebase, setFirebase] = React.useState(new Firebase());

  return (
    <FirebaseContext.Provider value={{ firebase, setFirebase }}>
      {children}
    </FirebaseContext.Provider>
  );
}

function useFirebase() {
  const context = React.useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error(`useFirebase must be used within a FirebaseProvider`);
  }
  return context;
}

export { useFirebase, FirebaseContext };
