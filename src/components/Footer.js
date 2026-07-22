import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <nav className="footer-links" aria-label="Footer">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/faq">FAQ</Link>
        <Link to="/newsletter">Newsletter</Link>
      </nav>
      <p className="footer-tagline">Built with React &amp; tested with Playwright.</p>
      <p className="footer-social">
        <a
          href="https://github.com/microsoft/sample-webapp"
          target="_blank"
          rel="noopener noreferrer"
        >
          View source on GitHub
        </a>
        <span className="footer-social-sep" aria-hidden="true">
          &middot;
        </span>
        <a
          href="https://github.com/microsoft/sample-webapp/issues/new"
          target="_blank"
          rel="noopener noreferrer"
        >
          Report an issue
        </a>
      </p>
      <p>&copy; {year} SampleApp. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
