// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
// Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCnmALKr_bgiquwX4YnA72kNBNxRqtsST8',
  authDomain: 'react-crud-exercise.firebaseapp.com',
  projectId: 'react-crud-exercise',
  storageBucket: 'react-crud-exercise.firebasestorage.app',
  messagingSenderId: '321425804622',
  appId: '1:321425804622:web:ac907603e4372cfa90221f',
  measurementId: 'G-ZNLFSWTCBD',
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore();
export const auth = getAuth();
