import React from 'react';
import './Loading.css';

function Loading({ message = 'Loading...', size = 'medium' }) {
  return (
    <div className={`loading loading-${size}`} role="status" aria-label={message}>
      <div className="spinner"></div>
      <p>{message}</p>
    </div>
  );
}

export default Loading;
