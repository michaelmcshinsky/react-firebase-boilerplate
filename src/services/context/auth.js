import React from 'react';
import { useFirebase } from './firebase';

const AuthContext = React.createContext();

export function AuthProvider({ children }) {
  const { firebase } = useFirebase();
  const [auth, setAuth] = React.useState(() => {
    const user = firebase.currentUser;
    return {
      initializing: !user || typeof user === 'function',
      user
    };
  });

  function set(user) {
    setAuth({ initializing: false, user });
  }

  function unset() {
    setAuth({ initializing: false, user: null });
  }

  React.useEffect(() => {
    const unsubscribe = firebase.onAuthUserListener(set, unset);

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error(`useAuth must be used within a AuthProvider`);
  }
  return context;
}

export { useAuth, AuthContext };
