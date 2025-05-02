import { Link } from "react-router-dom";
import { useAuthStatus } from "../hooks/useAuthStatus";
import { useFirestoreUser } from "../hooks/useFirestoreUser";

export default function Home() {
  const { loggedIn, checkingStatus } = useAuthStatus();
  const { userData, loading } = useFirestoreUser();
  
  const isLoading = checkingStatus || loading;

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mt-6">Home Page</h1>
      {isLoading ? (
        <p className="text-gray-600 mt-4">Loading...</p>
      ) : loggedIn ? (
        <p className="text-gray-600 mt-4">
          Welcome, <em>{userData?.displayName || "User"}</em>! This is your home page.
        </p>
      ) : (
        <p className="text-gray-600 mt-4">
          Welcome to the Home Page! This is where you can find the latest updates and information.
        </p>
      )}
      <Link to="/about">About</Link>
      <Link to="/app">App</Link>
    </div>
  );
}