import { JSX } from 'react';
import { Link, BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Offers from './pages/Offers';
import Profile from './pages/Profile';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import AppLayout from './pages/AppLayout';

function App(): JSX.Element {
  return (
    <Router>
      <div className="flex flex-col items-center justify-center bg-gray-100 p-6">
        <header className="flex space-x-4">
          <h1 className="text-4xl font-bold text-gray-800 mt-6">CRUD App</h1>
        </header>
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
      </div>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/app" element={<AppLayout />} />
        <Route path="/about" element={<About />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
