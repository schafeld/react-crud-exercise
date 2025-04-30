import { useState, useEffect, useRef } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';

interface AuthStatus {
  loggedIn: boolean;
  checkingStatus: boolean;
  currentUser: User | null;
}

export function useAuthStatus(): AuthStatus {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [checkingStatus, setCheckingStatus] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const isMounted = useRef(true); // To prevent state updates on unmounted component

  useEffect(() => {
    // Reset isMounted ref on re-render (though unlikely for a hook like this)
    isMounted.current = true; 
    
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (isMounted.current) { // Check if component is still mounted
        if (user) {
          setLoggedIn(true);
          setCurrentUser(user);
        } else {
          setLoggedIn(false);
          setCurrentUser(null);
        }
        setCheckingStatus(false);
      }
    });

    // Cleanup function: unsubscribe and update isMounted ref
    return () => {
      unsubscribe();
      isMounted.current = false; 
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  return { loggedIn, checkingStatus, currentUser };
}