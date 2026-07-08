import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import './Navbar.css';

function Navbar() {
  return (
    <nav>
      <Link to="/" className="logo">SampleApp</Link>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/faq">FAQ</Link>
        <Link to="/newsletter">Newsletter</Link>
        <Link to="/login">Login</Link>
        <Link to="/dashboard">Dashboard</Link>
        <ThemeToggle />
      </div>
    </nav>
  );
}

export default Navbar;
