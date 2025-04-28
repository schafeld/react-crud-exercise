import { NavLink, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut, User } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { app } from '../firebase'; // Assuming firebase is initialized in ../firebase

export default function Navigation() {
  const [user, setUser] = useState<User | null>(null);
  const auth = getAuth(app);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Optional: Redirect user after logout, e.g., to the home page
      navigate('/');
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Logout failed:', error);
      // Handle logout errors here
    }
  };

  return (
    <nav className="mt-4 flex items-center space-x-4">
      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive ? "text-blue-500 underline" : "text-blue-500"
        }
        end
      >
        Home
      </NavLink>
      <NavLink
        to="/about"
        className={({ isActive }) =>
          isActive ? "text-blue-500 underline" : "text-blue-500"
        }
      >
        About
      </NavLink>
      <NavLink
        to="/app"
        className={({ isActive }) =>
          isActive ? "text-blue-500 underline" : "text-blue-500"
        }
      >
        App
      </NavLink>
      {!user && ( // Only show Sign In if user is not logged in
        <NavLink
          to="/signin"
          className={({ isActive }) =>
            isActive ? "text-blue-500 underline" : "text-blue-500"
          }
        >
          Sign In
        </NavLink>
      )}
      {!user && ( // Only show Sign Up if user is not logged in
        <NavLink
          to="/signup"
          className={({ isActive }) =>
            isActive ? "text-blue-500 underline" : "text-blue-500"
          }
        >
          Sign Up
        </NavLink>
      )}
      {!user && ( // Only show Forgot Password if user is not logged in
        <NavLink
          to="/forgot-password"
          className={({ isActive }) =>
            isActive ? "text-blue-500 underline" : "text-blue-500"
          }
        >
          Forgot Password
        </NavLink>
      )}
      <NavLink
        to="/offers"
        className={({ isActive }) =>
          isActive ? "text-blue-500 underline" : "text-blue-500"
        }
      >
        Offers
      </NavLink>
      {user && ( // Only show Profile if user is logged in
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            isActive ? "text-blue-500 underline" : "text-blue-500"
          }
        >
          Profile
        </NavLink>
      )}
      {user && ( // Show Log Out button only if user is logged in
        <button
          onClick={handleLogout}
          className="text-red-500 hover:text-red-700 focus:outline-none"
        >
          Log Out
        </button>
      )}
    </nav>
  )
}
