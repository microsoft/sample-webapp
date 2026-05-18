# Test Plan

## Application

**Sample Web App** — Express-served static HTML app at `http://localhost:3000` with login form, dashboard, and navigation. Tests run against static pages in `public/` (not the React SPA in `src/`).

## Suites

### Login

1. **Login success message displays welcome text with username** — `tests/login.spec.ts`
   - Preconditions: `TEST_USER_EMAIL` and `TEST_USER_PASSWORD` env vars set
   - Step/Expectation Pairs:
     1. Step: Navigate to `/login`
        Expectation: Login form is displayed
     2. Step: Fill Username and Password with valid credentials, click Login
        Expectation: `#message` element becomes visible with class `success` and text content containing "Welcome"

### Navigation

2. **Navigate to home using nav links** — `tests/navigation.spec.ts`
   - Preconditions: None
   - Step/Expectation Pairs:
     1. Step: Navigate to `/dashboard`
        Expectation: Dashboard page loads
     2. Step: Click the "Home" nav link
        Expectation: URL changes to `/`
     3. Step: Navigate to `/login`
        Expectation: Login page loads
     4. Step: Click the "SampleApp" logo link
        Expectation: URL changes to `/`
