import { Button } from 'primereact/button';
// import 'primereact/resources/themes/saga-blue/theme.css'; // PrimeReact theme
import 'primereact/resources/primereact.min.css'; // PrimeReact core CSS
import 'primeicons/primeicons.css';
import { GoogleAuthProvider } from 'firebase/auth';
import { serverTimestamp, doc, setDoc } from 'firebase/firestore'
import { auth, db } from '../firebase.ts';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'primereact/toast'
import { useRef } from 'react';



type OAuthProps = {
  label?: string;
};

export default function OAuth({ label = "Continue with Google" }: OAuthProps) {
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);

  const handleGoogleSignIn = () => {
    // console.log('Google Sign-In clicked')
    // Add your Google Sign-In logic here
    try {
      const provider = new GoogleAuthProvider();
      signInWithPopup(auth, provider)
        .then((result) => {
          // // This gives you a Google Access Token. You can use it to access Google APIs.
          // const credential = GoogleAuthProvider.credentialFromResult(result);
          // const token = credential?.accessToken;
          // The signed-in user info.
          const user = result.user;
          console.log('Google Sign-In successful:', user);

          // Save user data to Firestore
          const userData = {
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            providerId: user.providerData[0].providerId,
            uid: user.uid,
            timestamp: serverTimestamp()
          };
          setDoc(doc(db, 'users', user.uid), userData)
            .then(() => {
              console.log('User data saved to Firestore:', userData);
            })
            .catch((error) => {
              console.error('Error saving user data to Firestore:', error);
              // Display error message
              toast.current?.show({
                severity: 'error',
                summary: 'Error Saving User Data',
                detail: 'An error occurred while saving user data.',
                life: 5000
              });
            });

          // Display success message and navigate to home page after a delay
          toast.current?.show({
            severity: 'success',
            summary: 'Google Sign-In Successful',
            detail: 'You have successfully signed in with Google.',
            life: 5000
          });

          setTimeout(() => {
            navigate('/');
          }, 2000);
        })
        .catch((error) => {
          console.error('Error during Google Sign-In:', error);
          toast.current?.show({
            severity: 'error',
            summary: 'Google Sign-In Failed',
            detail: 'An error occurred during Google Sign-In.',
            life: 5000
          });
        });
    } catch (error) {
      console.error('Error during Google Sign-In:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Google Sign-In Failed',
        detail: 'An error occurred during Google Sign-In.',
        life: 5000
      });
    }

  };

  return (
    <div className='w-full flex flex-col items-center justify-center'>

      {/* TODO: Use a shared component for this here and sign-up and sign-in */}
      <Toast
        ref={toast}
        content={({ message }) => (
            <div className="flex flex-col items-center">
            <h3 className="text-gray-500 mt-2 font-bold">
            {message.summary}
            </h3>
            <p className="text-gray-500 mt-2">
            {message.detail}
            </p>
            <Button
              label="Close"
              icon="pi pi-times mr-2"
              className="mt-2 p-button-secondary mb-4"
              iconPos="left"
              onClick={() => {
                toast.current?.clear()
              }
              }
            />
            </div>
        )}
        // There must be NO padding (e.g. p-4) here, else the toast will not disappear completely.
        className="w-150 max-w-md bg-amber-100 shadow-lg rounded-lg opacity-100 mt-4"
        position="top-center"
      />

      <Button
        label={label}
        icon="pi pi-google"
        className="p-button-rounded p-button-outlined w-full flex items-center justify-center hover:shadow-lg hover:bg-blue-300 active:bg-blue-800 active:text-white active:shadow-none transition duration-200 rounded"
        onClick={handleGoogleSignIn}
        style={{ gap: '0.5rem' }} // Reduces spacing between the icon and label.
      />
      <style>
      {`
        .p-button-label {
          flex: 0 1 auto;
        }
      `}
      </style>
    </div>
  );
}
