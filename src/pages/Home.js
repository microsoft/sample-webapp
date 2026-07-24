import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <h1>Welcome to Sample Web App</h1>
      <p id="description">A React web application built for Playwright testing. Feature branch users/dev71 adds a homepage content variant.</p>
      <div className="actions">
        <Link to="/login" className="btn btn-primary">Get Started</Link>
        <Link to="/dashboard" className="btn btn-secondary">View Dashboard</Link>
        <Link to="/about" className="btn btn-secondary">Learn More</Link>
      </div>
      <section id="features">
        <h2>Features</h2>
        <ul>
          <li>User authentication with form validation</li>
          <li>Interactive dashboard with stats</li>
          <li>Client-side routing with React Router</li>
          <li>Responsive design</li>
        </ul>
      </section>
      <p className="contact-hint" id="contact-hint">
        Have questions? <Link to="/contact">Contact us</Link>.
      </p>
    </div>
  );
}

export default Home;
