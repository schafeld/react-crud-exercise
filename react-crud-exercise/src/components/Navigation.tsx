import { NavLink } from 'react-router-dom';

export default function Navigation() {
  return (
    <nav className="mt-4">
      <NavLink 
        to="/" 
        className={({ isActive }) => 
          isActive ? "mx-2 text-blue-500 underline" : "mx-2 text-blue-500"
        }
        end
      >
        Home
      </NavLink>
      <NavLink 
        to="/about" 
        className={({ isActive }) => 
          isActive ? "mx-2 text-blue-500 underline" : "mx-2 text-blue-500"
        }
      >
        About
      </NavLink>
      <NavLink 
        to="/app" 
        className={({ isActive }) => 
          isActive ? "mx-2 text-blue-500 underline" : "mx-2 text-blue-500"
        }
      >
        App
      </NavLink>
      <NavLink 
        to="/signin" 
        className={({ isActive }) => 
          isActive ? "mx-2 text-blue-500 underline" : "mx-2 text-blue-500"
        }
      >
        Sign In
      </NavLink>
      <NavLink 
        to="/signup" 
        className={({ isActive }) => 
          isActive ? "mx-2 text-blue-500 underline" : "mx-2 text-blue-500"
        }
      >
        Sign Up
      </NavLink>
      <NavLink 
        to="/forgot-password" 
        className={({ isActive }) => 
          isActive ? "mx-2 text-blue-500 underline" : "mx-2 text-blue-500"
        }
      >
        Forgot Password
      </NavLink>
      <NavLink 
        to="/offers" 
        className={({ isActive }) => 
          isActive ? "mx-2 text-blue-500 underline" : "mx-2 text-blue-500"
        }
      >
        Offers
      </NavLink>
      <NavLink 
        to="/profile" 
        className={({ isActive }) => 
          isActive ? "mx-2 text-blue-500 underline" : "mx-2 text-blue-500"
        }
      >
        Profile
      </NavLink>
    </nav>
  )
}
