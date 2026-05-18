# Test Plan

## Application
Sample Web App — an Express server (`server.js`) serving static HTML pages: a login form (`/login`) with POST-based authentication and a dashboard (`/dashboard`) with stat cards and an activity table. Navigation bar links between pages.

## Suites

### Login
1. **Login end-to-end: valid credentials through to dashboard content** — `tests/login.spec.ts`
   - Preconditions: `TEST_USER_EMAIL` and `TEST_USER_PASSWORD` env vars set
   - Step/Expectation Pairs:
     1. Step: Navigate to `/login`
        Expectation: Login form is visible
     2. Step: Fill username and password with valid credentials, click Login
        Expectation: Success message is visible with class `success`
     3. Step: Wait for redirect
        Expectation: URL matches `/dashboard`
     4. Step: Verify dashboard content is loaded
        Expectation: Dashboard heading, at least one stat card, and the Recent Activity table are visible

2. **Login with missing password shows error** — `tests/login.spec.ts`
   - Preconditions: None
   - Step/Expectation Pairs:
     1. Step: Navigate to `/login`
        Expectation: Login form is visible
     2. Step: Remove `required` attribute from password field, fill only the username field, click Login
        Expectation: Error message is visible with class `error`
