import React, { useEffect, useState } from 'react';
import './CookieConsent.css';

const STORAGE_KEY = 'cookie-consent-accepted';

function CookieConsent() {
  const [accepted, setAccepted] = useState(true);

  useEffect(() => {
    try {
      setAccepted(localStorage.getItem(STORAGE_KEY) === 'true');
    } catch {
      setAccepted(false);
    }
  }, []);

  const accept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // Ignore storage errors (e.g. private mode); still dismiss for this session.
    }
    setAccepted(true);
  };

  if (accepted) {
    return null;
  }

  return (
    <div className="cookie-consent" role="dialog" aria-live="polite" aria-label="Cookie consent">
      <p className="cookie-consent-text">
        We use cookies to improve your experience on this site.
      </p>
      <button type="button" className="cookie-consent-accept" onClick={accept}>
        Accept
      </button>
    </div>
  );
}

export default CookieConsent;
