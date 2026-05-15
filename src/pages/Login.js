import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
            type="password"
            id="password"
            name="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
      {message && (
        <div id="message" className={`message ${error ? 'error' : 'success'}`}>
          {message}
        </div>
      )}
    </div>
  );
}

export default Login;
