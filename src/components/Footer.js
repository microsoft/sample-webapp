import React from 'react';
import './Footer.css';

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <p>&copy; {year} SampleApp. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
