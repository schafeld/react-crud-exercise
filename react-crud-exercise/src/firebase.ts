import { FirebaseApp, initializeApp } from 'firebase/app';
import { Firestore, getFirestore } from 'firebase/firestore';
import { Auth, getAuth } from 'firebase/auth';

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
  apiKey: '', // Add your Firebase API key here
  authDomain: 'react-crud-exercise.firebaseapp.com',
  projectId: 'react-crud-exercise',
  storageBucket: 'react-crud-exercise.firebasestorage.app',
  messagingSenderId: '321425804622',
  appId: '1:321425804622:web:ac907603e4372cfa90221f',
  measurementId: 'G-ZNLFSWTCBD',
};

const app: FirebaseApp = initializeApp(firebaseConfig);

export const db: Firestore = getFirestore(app);
export const auth: Auth = getAuth(app);
