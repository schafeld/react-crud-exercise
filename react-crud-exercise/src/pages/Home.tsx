import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function Home() {
  // Detect if user is logged in and get user data
  interface User {
    displayName: string | null;
  }
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);
  
  const isLoggedIn = user && user.displayName !== null;


  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mt-6">Home Page</h1>
      {isLoggedIn ? (
        <p className="text-gray-600 mt-4">
          Welcome, <em>{user.displayName || "User"}</em>! This is your home page.
        </p>
      ) : (
        <p className="text-gray-600 mt-4">
          Welcome to the Home Page! This is where you can find the latest updates and information.
        </p>
      )}
      <Link to="/about">About</Link>
      <Link to="/app">App</Link>
    </div>
  )
}