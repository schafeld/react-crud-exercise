import { ReactNode, JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStatus } from '../hooks/useAuthStatus'; // Assuming you have this custom hook

import { ProgressSpinner } from 'primereact/progressspinner';
        

interface ProtectedRouteProps {
  children: ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps): JSX.Element {
  const { loggedIn, checkingStatus } = useAuthStatus();

  if (checkingStatus) {
    return <ProgressSpinner />;
  }

  return loggedIn ? <>{children}</> : <Navigate to="/signin" />;
}

export default ProtectedRoute;