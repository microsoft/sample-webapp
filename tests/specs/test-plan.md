# Test Plan

## Application

Sample Web App — an Express-served static site with login and dashboard pages. Routes: `/` (blank React shell), `/login` (form + POST API), `/dashboard` (stats + activity table). Nav links on login and dashboard pages. baseURL: `http://localhost:3000`.

## Suites

### Login

1. **Network error shows fallback message** — `tests/login.spec.ts`
   - Preconditions: None (login-tests project, no auth state)
   - Step/Expectation Pairs:
     1. Step: Navigate to `/login`
        Expectation: Login form is visible
     2. Step: Mock POST `/login` route to return a network error
        Expectation: Route is intercepted
     3. Step: Fill username and password fields, click Login
        Expectation: `#message` element becomes visible with class `error` and text "An error occurred"

2. **Success message includes username** — `tests/login.spec.ts`
   - Preconditions: `TEST_USER_EMAIL` and `TEST_USER_PASSWORD` env vars set (login-tests project)
   - Note: Enhancement to existing test "should login successfully with valid credentials and redirect to dashboard" — add assertion that `#message` text contains the username
   - Step/Expectation Pairs:
     1. Step: (existing) Navigate to `/login`, fill credentials, click Login
        Expectation: (existing) `#message` visible with class `success`, redirects to `/dashboard`
     2. Step: (new assertion) Check message text content
        Expectation: Message contains "Welcome" and the submitted username
