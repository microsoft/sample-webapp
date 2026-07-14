import React, { useState } from 'react';

/**
 * Newsletter signup page. Simple, self-contained feature with clear, testable
 * behavior: email validation, duplicate guard, and a success confirmation.
 */
function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null); // 'success' | 'error' | 'duplicate'
  const [subscribed, setSubscribed] = useState([]);

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = email.trim();
    if (!isValidEmail(value)) {
      setStatus('error');
      return;
    }
    if (subscribed.includes(value.toLowerCase())) {
      setStatus('duplicate');
      return;
    }
    setSubscribed((prev) => [...prev, value.toLowerCase()]);
    setStatus('success');
    setEmail('');
  };

  return (
    <div className="page newsletter-page" style={{ maxWidth: 480, margin: '2rem auto', padding: '1rem' }}>
      <h1>Newsletter</h1>
      <p>Subscribe to get the latest updates in your inbox.</p>

      <form onSubmit={handleSubmit} aria-label="newsletter-form" noValidate>
        <label htmlFor="newsletter-email">Email address</label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="email"
          data-testid="newsletter-email"
        />
        <button type="submit" data-testid="newsletter-subscribe">
          Subscribe
        </button>
      </form>

      <p id="newsletter-count" data-testid="newsletter-count">
        {subscribed.length} subscriber{subscribed.length === 1 ? '' : 's'}
      </p>

      {status === 'success' && (
        <p role="status" data-testid="newsletter-success" style={{ color: 'green' }}>
          Thanks for subscribing! Please check your inbox to confirm.
        </p>
      )}
      {status === 'duplicate' && (
        <p role="alert" data-testid="newsletter-duplicate" style={{ color: 'orange' }}>
          You are already subscribed with this email.
        </p>
      )}
      {status === 'error' && (
        <p role="alert" data-testid="newsletter-error" style={{ color: 'red' }}>
          Please enter a valid email address.
        </p>
      )}
    </div>
  );
}

export default Newsletter;
