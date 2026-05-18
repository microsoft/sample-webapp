# Test Plan

## Application
Sample Web App — an Express server (`server.js`) at `http://localhost:3000` serving static HTML pages: a login form (`/login`) and a dashboard with stat cards and an activity table (`/dashboard`). Tests run with Playwright against the Express server. A React source tree exists in `src/` but is not served by the current configuration.

## Suites

### Login
1. **Login form displays required fields** — `tests/login.spec.ts`
   - Preconditions: None
   - Step/Expectation Pairs:
     1. Step: Navigate to /login
        Expectation: Page title contains "Login", h1 "Login" heading visible
     2. Step: Inspect form elements
        Expectation: Username textbox, Password textbox, and Login button are all visible

2. **Login success message displays welcome text** — `tests/login.spec.ts`
   - Preconditions: TEST_USER_EMAIL and TEST_USER_PASSWORD env vars set
   - Step/Expectation Pairs:
     1. Step: Navigate to /login
        Expectation: Login page loads
     2. Step: Fill username and password fields with valid credentials, click Login
        Expectation: Success message appears containing "Welcome" and the submitted username
     3. Step: Wait for redirect
        Expectation: URL changes to /dashboard

3. **Login success redirects to dashboard** — `tests/login.spec.ts`
   - Preconditions: TEST_USER_EMAIL and TEST_USER_PASSWORD env vars set
   - Step/Expectation Pairs:
     1. Step: Navigate to /login, fill valid credentials, click Login
        Expectation: Success message visible with class "success"
     2. Step: Wait for redirect
        Expectation: URL changes to /dashboard

4. **Login empty form shows error message** — `tests/login.spec.ts`
   - Preconditions: None
   - Step/Expectation Pairs:
     1. Step: Navigate to /login
        Expectation: Login page loads
     2. Step: Remove required attributes from form fields, click Login with empty fields
        Expectation: Error message appears with class "error"

5. **Login shows error on network failure** — `tests/login.spec.ts` *(new)*
   - Preconditions: None
   - Step/Expectation Pairs:
     1. Step: Navigate to /login
        Expectation: Login page loads
     2. Step: Mock POST /login to abort (simulate network failure)
        Expectation: Route is intercepted
     3. Step: Fill username and password fields, click Login
        Expectation: Error message appears containing "An error occurred"

### Dashboard
6. **Dashboard heading and title** — `tests/dashboard.spec.ts`
   - Preconditions: Authenticated (storageState from auth.setup.ts)
   - Step/Expectation Pairs:
     1. Step: Navigate to /dashboard
        Expectation: Page title contains "Dashboard", h1 "Dashboard" heading visible

7. **Dashboard stat cards display correct values** — `tests/dashboard.spec.ts`
   - Preconditions: Authenticated (storageState from auth.setup.ts)
   - Step/Expectation Pairs:
     1. Step: Navigate to /dashboard
        Expectation: Dashboard page loads
     2. Step: Inspect stat card headings
        Expectation: Users, Revenue, and Orders headings visible with non-empty values
     3. Step: Inspect stat card values
        Expectation: Users="128", Revenue="$12,450", Orders="340"

8. **Dashboard activity table displays correct row data** — `tests/dashboard.spec.ts` *(new)*
   - Preconditions: Authenticated (storageState from auth.setup.ts)
   - Step/Expectation Pairs:
     1. Step: Navigate to /dashboard
        Expectation: Recent Activity heading and table visible
     2. Step: Inspect table column headers
        Expectation: User, Action, Date headers present
     3. Step: Inspect first row
        Expectation: Alice / Created account / 2026-05-14
     4. Step: Inspect second row
        Expectation: Bob / Placed order / 2026-05-13
     5. Step: Inspect third row
        Expectation: Charlie / Updated profile / 2026-05-12

### Navigation
9. **Nav links navigate between pages** — `tests/navigation.spec.ts`
   - Preconditions: Authenticated (storageState from auth.setup.ts)
   - Step/Expectation Pairs:
     1. Step: Navigate to /login
        Expectation: All nav links visible (SampleApp, Home, Login, Dashboard)
     2. Step: Click Dashboard link
        Expectation: URL changes to /dashboard
     3. Step: Click Login link
        Expectation: URL changes to /login

10. **Home and logo links navigate to root** — `tests/navigation.spec.ts`
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
