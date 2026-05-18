# Test Plan

## Application
Sample Web App — a React application with React Router that provides routes such as the login form and dashboard (with stats/activity table) at `http://localhost:3000`. Tests run with Playwright against the React app, typically via the local dev server. If `server.js` is also used to serve static pages, treat that as an alternate serving option rather than the primary app description.

## Suites

### Login
1. **Login success message displays welcome text** — `tests/login.spec.ts`
   - Preconditions: TEST_USER_EMAIL and TEST_USER_PASSWORD env vars set
   - Step/Expectation Pairs:
     1. Step: Navigate to /login
        Expectation: Login page loads
     2. Step: Fill username and password fields with valid credentials, click Login
        Expectation: Success message appears containing "Welcome" and the submitted username
     3. Step: Wait for redirect
        Expectation: URL changes to /dashboard

### Dashboard
2. **Dashboard stat cards display correct values** — `tests/dashboard.spec.ts`
   - Preconditions: Authenticated (storageState from auth.setup.ts)
   - Step/Expectation Pairs:
     1. Step: Navigate to /dashboard
        Expectation: Dashboard page loads
     2. Step: Inspect Users stat card value
        Expectation: Displays "128"
     3. Step: Inspect Revenue stat card value
        Expectation: Displays "$12,450"
     4. Step: Inspect Orders stat card value
        Expectation: Displays "340"

### Navigation
3. **Home and logo links navigate to root** — `tests/navigation.spec.ts`
   - Preconditions: Authenticated (storageState from auth.setup.ts)
   - Step/Expectation Pairs:
     1. Step: Navigate to /dashboard
        Expectation: Dashboard page loads
     2. Step: Click "Home" nav link
        Expectation: URL changes to /
     3. Step: Navigate to /login
        Expectation: Login page loads
     4. Step: Click "SampleApp" logo link
        Expectation: URL changes to /
