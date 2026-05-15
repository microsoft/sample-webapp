let authToken = null;
// Intentionally in-memory only to avoid persistent token exposure in browser storage.

export function setAuthToken(token) {
  authToken = typeof token === 'string' && token.trim() ? token : null;
}

export function getAuthToken() {
  return authToken;
}

export function clearAuthToken() {
  authToken = null;
}
