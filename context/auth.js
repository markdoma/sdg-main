// hooks/auth.js
import { useState, useEffect, useContext, createContext } from 'react';
import firebase, { auth, db } from '../utils/firebase';
// import firebase from 'firebase/app';

const authContext = createContext();

export function AuthProvider({ children }) {
  const authProvider = useProvideAuth();
  return (
    <authContext.Provider value={authProvider}>{children}</authContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(authContext);
};

function useProvideAuth() {
  const [user, setUser] = useState(null);

  const signInWithGoogle = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();

    try {
      const result = await auth.signInWithPopup(provider);
      const user = result.user;
      console.log(user.email);

      // Retrieve the user mapping from Firestore based on the Google user's ID
      const userMappingDoc = await db
        .collection('usersMapping')
        .doc(user.email)
        // .doc('test')
        .get();

      console.log(userMappingDoc.exists);

      if (userMappingDoc.exists) {
        const pl = userMappingDoc.data().pl;
        console.log(pl);

        // Use the fieldValue to fetch collection data
        const collectionDataSnapshot = await db
          .collection('master_data')
          .where('pl', '==', pl)
          .get();

        // Now you can do something with the fetched data
        collectionDataSnapshot.forEach((doc) => {
          console.log(doc.data());
        });

        setUser(user);
      } else {
        // If the user mapping doesn't exist, sign them out
        await auth.signOut();
        throw new Error('Unauthorized user');
      }
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const signOut = async () => {
    try {
      await auth().signOut();
      setUser(null);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return {
    user,
    signInWithGoogle,
    signOut,
  };
}
