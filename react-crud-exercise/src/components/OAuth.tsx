import React from 'react';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/saga-blue/theme.css'; // Import PrimeReact theme
import 'primereact/resources/primereact.min.css'; // Import PrimeReact core CSS
import 'primeicons/primeicons.css'; // Import PrimeIcons

export default function OAuth() {
  const handleGoogleSignIn = () => {
    console.log('Google Sign-In clicked');
    // Add your Google Sign-In logic here
  };

  return (
    <div className='w-full flex flex-col items-center justify-center'>
      <Button
        label="Sign in with Google"
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
