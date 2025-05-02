import { NavLink, useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { app } from '../firebase';
import { useAuthStatus } from '../hooks/useAuthStatus';

export default function Navigation() {
  const { loggedIn, checkingStatus } = useAuthStatus();
  const auth = getAuth(app);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (checkingStatus) {
    return null;
  }

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
      <NavLink
        to="/offers"
        className={({ isActive }) =>
          isActive ? "text-blue-500 underline" : "text-blue-500"
        }
      >
        Offers
      </NavLink>
      {!loggedIn && (
        <NavLink
          to="/signin"
          className={({ isActive }) =>
            isActive ? "text-blue-500 underline" : "text-blue-500"
          }
        >
          Sign In
        </NavLink>
      )}
      {!loggedIn && (
        <NavLink
          to="/signup"
          className={({ isActive }) =>
            isActive ? "text-blue-500 underline" : "text-blue-500"
          }
        >
          Sign Up
        </NavLink>
      )}
      {!loggedIn && (
        <NavLink
          to="/forgot-password"
          className={({ isActive }) =>
            isActive ? "text-blue-500 underline" : "text-blue-500"
          }
        >
          Forgot Password
        </NavLink>
      )}
      {loggedIn && (
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            isActive ? "text-blue-500 underline" : "text-blue-500"
          }
        >
          Profile
        </NavLink>
      )}
      {loggedIn && (
        <button
          onClick={handleLogout}
          className="text-red-500 hover:text-red-700 focus:outline-none whitespace-nowrap"
        >
          Log Out
        </button>
      )}
    </nav>
  );
}
