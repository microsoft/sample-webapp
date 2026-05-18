# Test Plan

## Application
Sample Web App — Express static server at `http://localhost:3000` serving login form, dashboard with stats/activity table, and a home page (empty in static mode). Authentication via username/password POST to `/login`.

## Suites

### Login
1. **Verify welcome message contains username on successful login** — `tests/login.spec.ts`
   - Preconditions: `TEST_USER_EMAIL` and `TEST_USER_PASSWORD` env vars set
   - Step/Expectation Pairs:
     1. Step: Navigate to `/login`
        Expectation: Login form is visible
     2. Step: Fill Username with `TEST_USER_EMAIL`, fill Password with `TEST_USER_PASSWORD`, click Login
        Expectation: `#message` element becomes visible with class `success` and text content containing the username value (e.g. "Welcome, {username}!")

### Dashboard
1. **Verify stat card values match expected data** — `tests/dashboard.spec.ts`
   - Preconditions: Authenticated (storageState from auth setup)
   - Step/Expectation Pairs:
     1. Step: Navigate to `/dashboard`
        Expectation: `#user-count` has text "128", `#revenue` has text "$12,450", `#order-count` has text "340"

2. **Verify activity table row content** — `tests/dashboard.spec.ts`
   - Preconditions: Authenticated (storageState from auth setup)
   - Step/Expectation Pairs:
     1. Step: Navigate to `/dashboard`
        Expectation: Activity table first row contains "Alice", "Created account", "2026-05-14"; second row contains "Bob", "Placed order", "2026-05-13"; third row contains "Charlie", "Updated profile", "2026-05-12"
