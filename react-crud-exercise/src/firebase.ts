import { FirebaseApp, initializeApp } from 'firebase/app';
import { Firestore, getFirestore } from 'firebase/firestore';
import { Auth, getAuth } from 'firebase/auth';
import { FirebaseStorage, getStorage } from 'firebase/storage';  // Add this import

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string; // Optional
}

const firebaseConfig: FirebaseConfig = {
  // TODO: Connect API-Key with specific domain for deployment!
  // Be absolutely sure to have DB rules set up to prevent unauthorized access.
  apiKey: '', // Add your Firebase API key here // TODO: dotenv?
  authDomain: 'react-crud-exercise.firebaseapp.com',
  projectId: 'react-crud-exercise',
  storageBucket: 'react-crud-exercise.firebasestorage.app',
  messagingSenderId: '321425804622',
  appId: '1:321425804622:web:ac907603e4372cfa90221f',
  measurementId: "G-VMVZ168M8Q"
};

export const app: FirebaseApp = initializeApp(firebaseConfig);

export const db: Firestore = getFirestore(app);
export const auth: Auth = getAuth(app);
export const storage: FirebaseStorage = getStorage(app);  // Add this export
