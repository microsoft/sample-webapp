# sample-webapp
Sample web application for Playwright testing

Authentication tokens are kept in memory (not persisted in browser storage) to reduce exposure to XSS token exfiltration, so users must sign in again after a page refresh or tab close.
