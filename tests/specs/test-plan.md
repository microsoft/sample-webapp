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

### Contact
4. **Contact form submits successfully and shows a confirmation toast** — `tests/contact.spec.ts`
   - Preconditions: None — `/contact` is a public route (no auth or seeded data required); the form is client-only, so there is nothing to create or clean up.
   - Step/Expectation Pairs:
     1. Step: Navigate to / then click the "Contact" navbar link
        Expectation: URL changes to /contact and the "Contact Us" heading (level 1) is visible
     2. Step: Fill Name with "Jane Doe", Email with a valid address (e.g. "jane.doe@example.com"), and Message with a 10+ character message, then click "Send Message"
        Expectation: A success toast (getByTestId('toast')) appears containing "Thanks! Your message has been sent."
     3. Step: Observe the form after submission
        Expectation: The Name, Email, and Message fields are cleared (form reset); no field-level validation errors are shown
     4. Step: Click the toast's "Close notification" button
        Expectation: The toast is dismissed (no longer visible)
5. **Contact form rejects invalid input with field errors and no toast** — `tests/contact.spec.ts`
   - Preconditions: None — `/contact` is a public route; the form is client-only, so there is nothing to create or clean up.
   - Step/Expectation Pairs:
     1. Step: Navigate to /contact and click "Send Message" with all fields empty
        Expectation: Field errors "Name is required", "Email is required", and "Message is required" are shown; no success toast appears (getByTestId('toast') has count 0)
     2. Step: Fill Name with "Jane", Email with an invalid address "not-an-email", and Message with a short value "short", then click "Send Message"
        Expectation: The email error "Enter a valid email address" and the message error "Message must be at least 10 characters" are shown, the Name field has no error, and still no success toast appears
6. **Contact form clears a field error live once the field is corrected** — `tests/contact.spec.ts`
   - Preconditions: None — `/contact` is a public route; the form is client-only, so there is nothing to create or clean up.
   - Step/Expectation Pairs:
     1. Step: Navigate to /contact and click "Send Message" with all fields empty
        Expectation: Field errors "Name is required" and "Email is required" are shown (all fields marked touched)
     2. Step: Type a valid value into the Name field (without resubmitting)
        Expectation: The "Name is required" error clears immediately while "Email is required" remains; no success toast appears
7. **Contact form shows a single field's error on blur without submitting** — `tests/contact.spec.ts`
   - Preconditions: None — `/contact` is a public route; the form is client-only, so there is nothing to create or clean up.
   - Step/Expectation Pairs:
     1. Step: Navigate to /contact, focus the Name field, then blur it (e.g. focus the Email field) while Name is left empty — do NOT click "Send Message"
        Expectation: Only the "Name is required" error appears; the Email and Message fields show no error (they are still untouched), and no success toast appears (getByTestId('toast') has count 0)
     2. Step: Blur the still-empty Email field (e.g. focus the Message field) without submitting
        Expectation: The "Email is required" error now also appears (each field is validated on its own blur), while the still-untouched Message field shows no error and no success toast appears
