import React from 'react';
import './Toast.css';

function Toast({ message, type = 'info', onClose }) {
  const icons = {
    success: '\u2713',
    error: '\u2717',
    warning: '\u26A0',
    info: '\u2139',
  };

  return (
    <div className={`toast toast-${type}`} role="alert" data-testid="toast">
      <span className="toast-icon">{icons[type]}</span>
      <span className="toast-message">{message}</span>
      {onClose && (
        <button className="toast-close" onClick={onClose} aria-label="Close notification">
          {'\u00d7'}
        </button>
      )}
    </div>
  );
}

export default Toast;
