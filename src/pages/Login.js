import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

/**
 * Login page component.
 *
 * Accessibility & test conventions used throughout this repo:
 * - Heading: <h1>Login</h1>, targeted via
 *   getByRole('heading', { name: 'Login', level: 1 }).
 * - Inputs: username and password are <input> elements with associated <label>;
 *   target via getByRole('textbox', { name: 'Username' | 'Password' }).
 * - Submit: <button type="submit">Login</button>; target via
 *   getByRole('button', { name: 'Login' }).
 * - Message banner: a single <div id="message"> that toggles between
 *   role="status" (success) and role="alert" (error). It has
 *   aria-live="polite" and a className containing 'success' or 'error'.
 *   Playwright specs target it via page.getByRole('status') or
 *   page.getByRole('alert'), then assert .toHaveClass(/success|error/).
 */
function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setMessage('Username and password are required');
      setError(true);
      return;
    }

    if (password.length < 6) {
      setMessage('Password must be at least 6 characters');
      setError(true);
      return;
    }

    setMessage(`Welcome, ${username}!`);
    setError(false);
    setTimeout(() => navigate('/dashboard'), 1500);
  };

  return (
    <div className="login">
      <h1>Login</h1>
      <form id="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            id="toggle-password"
            className="toggle-password"
            aria-pressed={showPassword}
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? 'Hide password' : 'Show password'}
          </button>
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
      {message && (
        <div
          id="message"
          role={error ? 'alert' : 'status'}
          aria-live="polite"
          className={`message ${error ? 'error' : 'success'}`}
        >
          {message}
        </div>
      )}
    </div>
  );
}

export default Login;
