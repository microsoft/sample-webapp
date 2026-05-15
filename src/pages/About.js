import React from 'react';
import './About.css';

function About() {
  return (
    <div className="about">
      <h1>About Us</h1>
      <section className="about-intro">
        <p>
          Sample Web App is a modern React application designed to demonstrate
          best practices in front-end development and serve as a testing ground
          for Playwright end-to-end tests.
        </p>
      </section>

      <section className="about-team">
        <h2>Our Team</h2>
        <div className="team-grid">
          <div className="team-card">
            <div className="avatar">KG</div>
            <h3>Kashish Gupta</h3>
            <p>Lead Developer</p>
          </div>
          <div className="team-card">
            <div className="avatar">AI</div>
            <h3>Copilot</h3>
            <p>AI Assistant</p>
          </div>
        </div>
      </section>

      <section className="about-tech">
        <h2>Tech Stack</h2>
        <ul className="tech-list">
          <li><span className="tech-badge">React 18</span></li>
          <li><span className="tech-badge">React Router v6</span></li>
          <li><span className="tech-badge">Playwright</span></li>
          <li><span className="tech-badge">CSS3</span></li>
        </ul>
      </section>

      <section className="about-contact">
        <h2>Contact</h2>
        <form id="contact-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" placeholder="Your name" />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="Your email" />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea id="message" rows="4" placeholder="Your message"></textarea>
          </div>
          <button type="submit" className="btn btn-primary">Send Message</button>
        </form>
      </section>
    </div>
  );
}

export default About;
