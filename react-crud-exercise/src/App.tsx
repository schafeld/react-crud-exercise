import { JSX } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Navigation from './components/Navigation';
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
        <Header></Header>
        <Navigation />
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
