# Test Plan

## Application

Sample Web App — an Express server serving static HTML pages: a login form (`/login`) with POST-based authentication and a dashboard (`/dashboard`) with stat cards and a recent activity table. The homepage (`/`) serves an empty React shell. Tests run against `http://localhost:3000` via `node server.js`.

## Suites

### Login Flow

1. **Login success shows personalized welcome message** — `tests/login.spec.ts`
   - Preconditions: No auth state; `TEST_USER_EMAIL` and `TEST_USER_PASSWORD` env vars set
   - Step/Expectation Pairs:
     1. Step: Navigate to `/login`
        Expectation: Login form is visible
     2. Step: Fill username and password fields with valid credentials, click Login
        Expectation: Success message appears containing the text "Welcome, " followed by the username

### User Journey

1. **Complete login-to-dashboard journey** — `tests/login-to-dashboard.spec.ts`
   - Preconditions: No auth state; `TEST_USER_EMAIL` and `TEST_USER_PASSWORD` env vars set
   - Step/Expectation Pairs:
     1. Step: Navigate to `/login`
        Expectation: Login heading and form fields are visible
     2. Step: Fill username and password with valid credentials, click Login
        Expectation: Success message is visible with `.success` class
     3. Step: Wait for redirect to `/dashboard`
        Expectation: URL matches `/dashboard`, page title contains "Dashboard"
     4. Step: Verify dashboard content loaded
        Expectation: Dashboard h1 heading is visible, stat cards for Users/Revenue/Orders are visible, Recent Activity table is visible with data rows

### Dashboard Content

1. **Stat cards display correct values** — `tests/dashboard.spec.ts`
   - Preconditions: Authenticated (storageState from auth setup)
   - Step/Expectation Pairs:
     1. Step: Navigate to `/dashboard`
        Expectation: User count displays "128"
     2. Step: Check Revenue stat card
        Expectation: Revenue displays "$12,450"
     3. Step: Check Orders stat card
        Expectation: Order count displays "340"

2. **Activity table displays correct row data** — `tests/dashboard.spec.ts`
   - Preconditions: Authenticated (storageState from auth setup)
   - Step/Expectation Pairs:
     1. Step: Navigate to `/dashboard`
        Expectation: Activity table is visible with 3 data rows
     2. Step: Check first row content
        Expectation: Row contains "Alice", "Created account", "2026-05-14"
     3. Step: Check second row content
        Expectation: Row contains "Bob", "Placed order", "2026-05-13"
     4. Step: Check third row content
        Expectation: Row contains "Charlie", "Updated profile", "2026-05-12"
