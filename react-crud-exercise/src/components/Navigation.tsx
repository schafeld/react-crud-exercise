import { Link } from 'react-router-dom';
export default function Navigation() {
  return (
        <nav className="mt-4">
          <Link to="/" className="mx-2 text-blue-500">Home</Link>
          <Link to="/about" className="mx-2 text-blue-500">About</Link>
          <Link to="/app" className="mx-2 text-blue-500">App</Link>
          <Link to="/signin" className="mx-2 text-blue-500">Sign In</Link>
          <Link to="/signup" className="mx-2 text-blue-500">Sign Up</Link>
          <Link to="/forgot-password" className="mx-2 text-blue-500">Forgot Password</Link>
          <Link to="/offers" className="mx-2 text-blue-500">Offers</Link>
          <Link to="/profile" className="mx-2 text-blue-500">Profile</Link>
        </nav>
  )
}
