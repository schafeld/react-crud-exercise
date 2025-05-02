import { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '../firebase';
import { useAuthStatus } from './useAuthStatus';

// Define the interface for user data from Firestore
export interface FirestoreUserData {
  displayName?: string;
  email?: string;
  photoURL?: string;
  // Add any other fields from your Firestore users collection
}

export function useFirestoreUser() {
  const [userData, setUserData] = useState<FirestoreUserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const { currentUser, checkingStatus } = useAuthStatus();
  const db = getFirestore(app);

  useEffect(() => {
    async function fetchUserData() {
      if (!currentUser) {
        setLoading(false);
        setUserData(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const userDocRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(userDocRef);
        
        if (docSnap.exists()) {
          setUserData(docSnap.data() as FirestoreUserData);
        } else {
          // Fallback to auth user data if no Firestore document exists
          setUserData({
            displayName: currentUser.displayName || undefined,
            email: currentUser.email || undefined,
            photoURL: currentUser.photoURL || undefined
          });
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to fetch user data");
        
        // Fallback to auth user data on error
        setUserData({
          displayName: currentUser.displayName || undefined,
          email: currentUser.email || undefined
        });
      } finally {
        setLoading(false);
      }
    }

    // Only fetch when auth status check is complete
    if (!checkingStatus) {
      fetchUserData();
    }
  }, [currentUser, checkingStatus, db]);

  return { userData, loading, error };
}