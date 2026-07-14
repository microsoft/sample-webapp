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
22. **Login rejects a password shorter than 6 characters** — `tests/login.spec.ts`
   - Preconditions: None — `/login` is a public route; the length guard is client-side (`password.length < 6` in `Login.js`), so no auth or seeded data is needed. Nothing to create or clean up.
   - Postconditions: None.
   - Step/Expectation Pairs:
     1. Step: Navigate to /login, fill Username with a non-empty value (e.g. "tester") and Password with a value shorter than 6 characters (e.g. "abc"), then click "Login"
        Expectation: The message banner (`#message`, `role="alert"`) is visible with the exact text "Password must be at least 6 characters"
     2. Step: Observe the page after submission
        Expectation: The URL stays on /login (no redirect to /dashboard occurs), confirming the guard blocks submission

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
27. **Recent Activity search filters the table and shows an empty state for no matches** — `tests/dashboard.spec.ts`
   - Preconditions: Authenticated (storageState from auth.setup.ts). No data to seed — the activity rows are client-side static data; the filter resets on navigation, so nothing to create or clean up.
   - Postconditions: None.
   - Step/Expectation Pairs:
     1. Step: Navigate to /dashboard and locate the "Search activity" searchbox (`#activity-search`) under the "Recent Activity" heading
        Expectation: The searchbox is visible and the activity table (`#activity-table`) shows all three data rows (Alice, Bob, Charlie)
     2. Step: Type a query matching a single row (e.g. "Bob") into the searchbox
        Expectation: The table body shows only the matching row ("Bob"); the non-matching rows ("Alice", "Charlie") are no longer present
     3. Step: Replace the query with one that matches nothing (e.g. "zzz")
        Expectation: No activity data rows remain and the empty-state message `#activity-empty` "No matching activity found." is visible
     4. Step: Clear the searchbox
        Expectation: All three data rows are restored and the empty-state message is no longer shown

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

### FAQ
8. **FAQ question expands to reveal its answer and collapses again** — `tests/faq.spec.ts`
   - Preconditions: None — `/faq` is a public route with hard-coded content; nothing to create or clean up.
   - Step/Expectation Pairs:
     1. Step: Navigate to / then click the "FAQ" navbar link
        Expectation: URL changes to /faq and the "Frequently Asked Questions" heading (level 1) is visible; all five question buttons are collapsed (aria-expanded="false") and no answer region is shown
     2. Step: Click the first question button ("What is Sample Web App?")
        Expectation: That button becomes aria-expanded="true" and its answer region (role="region", named by the question) becomes visible with the answer text
     3. Step: Click the same question button again
        Expectation: The button returns to aria-expanded="false" and its answer region is no longer visible
9. **FAQ accordion keeps only one answer open at a time** — `tests/faq.spec.ts`
   - Preconditions: None — `/faq` is a public route with hard-coded content; nothing to create or clean up.
   - Step/Expectation Pairs:
     1. Step: Navigate to /faq and click the first question ("What is Sample Web App?")
        Expectation: The first question is aria-expanded="true" and its answer region is visible
     2. Step: Click a second, different question ("How do I create an account?")
        Expectation: The second question's answer region becomes visible (aria-expanded="true"), while the first question collapses to aria-expanded="false" and its answer region is no longer visible (only one panel open at a time)
16. **FAQ search filter narrows the question list and clearing restores it** — `tests/faq.spec.ts`
    - Preconditions: None — `/faq` is a public route with hard-coded content and the search box is in-memory component state that resets on navigation; nothing to create or clean up.
    - Step/Expectation Pairs:
      1. Step: Navigate to /faq and type a term that appears only in answer text, not in any question — e.g. "playwright" — into the search box (getByRole('searchbox', { name: 'Search questions' }))
         Expectation: The list narrows to exactly the two questions whose answers contain the term — "What is Sample Web App?" and "Which technologies are used?" (matched via answer content, not question text) — and the other three question buttons are no longer present
      2. Step: Clear the search box (fill with an empty string)
         Expectation: All five question buttons are visible again (the empty query restores the full list)
17. **FAQ search with no matches shows the empty-state message** — `tests/faq.spec.ts`
    - Preconditions: None — `/faq` is a public route with hard-coded content; the search box is in-memory state that resets on navigation. Nothing to create or clean up.
    - Step/Expectation Pairs:
      1. Step: Navigate to /faq and type a query that matches no question or answer (e.g. "zzzznomatch") into the search box
         Expectation: No question buttons are present (count 0) and the empty-state message (role="status", `.faq-empty`) is visible with the text `No questions match "zzzznomatch".` (the trimmed query is echoed back)
18. **FAQ search shows a results count while filtering and hides it when cleared** — `tests/faq.spec.ts`
    - Preconditions: None — `/faq` is a public route with hard-coded content; the search box and results count are in-memory state that resets on navigation. Nothing to create or clean up.
    - Step/Expectation Pairs:
      1. Step: Navigate to /faq without typing anything
         Expectation: No results-count text (`Showing N of M questions`, `.faq-results-count`) is present — the count only appears once a query is entered
      2. Step: Type a term that matches a subset of FAQs (e.g. "playwright", which matches two of five)
         Expectation: The results count is visible and reads `Showing 2 of 5 questions`
      3. Step: Clear the search box (fill with an empty string)
         Expectation: The results-count text is no longer present (the count is hidden when there is no active query)
19. **FAQ search clears when the Escape key is pressed** — `tests/faq.spec.ts`
    - Preconditions: None — `/faq` is a public route with hard-coded content; the search box is in-memory state that resets on navigation. Nothing to create or clean up.
    - Step/Expectation Pairs:
      1. Step: Navigate to /faq and type a filtering term (e.g. "dark") into the search box (getByRole('searchbox', { name: 'Search questions' }))
         Expectation: The list is filtered — the search box holds the typed value and the results count (`Showing 1 of 5 questions`) is visible
      2. Step: Press the Escape key while focus is in the search box
         Expectation: The search box is cleared (value is empty), the results count is no longer present, and all five question buttons are visible again (the Escape handler resets the query and the list)

### Scroll Progress
20. **Scroll progress bar reflects scroll position from top (0%) to bottom (100%)** — `tests/scroll-progress.spec.ts`
    - Preconditions: None — uses the public `/about` page (the tallest public route) rendered at a reduced viewport height so it is comfortably scrollable; the ScrollProgress component is global (rendered outside `<Routes>` in `App.js`). Nothing to create or clean up.
    - Step/Expectation Pairs:
      1. Step: Set a short viewport (e.g. 1280×400) and navigate to /about
         Expectation: The progress bar (getByRole('progressbar', { name: 'Page scroll progress' })) is present with aria-valuenow="0" (nothing scrolled yet)
      2. Step: Scroll the page to the bottom (e.g. page.mouse.wheel with a large delta, or press the End key so the scroll offset reaches the maximum)
         Expectation: The progress bar's aria-valuenow becomes "100" (the bar is full once the page is scrolled to the bottom)

### Scroll To Top
10. **Scroll-to-top button appears after scrolling down and returns the page to the top** — `tests/scroll-to-top.spec.ts`
    - Preconditions: None — uses the public `/about` page (the tallest public route) rendered at a reduced viewport height so it is scrollable well past the button's 300px threshold; nothing to create or clean up.
    - Step/Expectation Pairs:
      1. Step: Set a short viewport (e.g. 1280×400) and navigate to /about
         Expectation: The scroll-to-top button (getByTestId('scroll-to-top'), aria-label "Scroll back to top") is not present (the component renders nothing while the page is at the top)
      2. Step: Scroll the page down past the 300px threshold (e.g. page.mouse.wheel(0, 600))
         Expectation: The scroll-to-top button becomes visible
      3. Step: Click the scroll-to-top button
         Expectation: The page returns to the top and the button disappears again (it unmounts once the scroll offset drops back to/below 300px)

### Footer
11. **Site footer shows the runtime copyright year on every page** — `tests/footer.spec.ts`
    - Preconditions: None — the footer is a global component (rendered outside `<Routes>` in `App.js`) on public routes; nothing to create or clean up.
    - Step/Expectation Pairs:
      1. Step: Navigate to each public route (`/`, `/login`, `/dashboard`, `/about`, `/contact`, `/faq`)
        Expectation: The footer (getByRole('contentinfo')) is visible and contains the text `© <currentYear> SampleApp. All rights reserved.`, where `<currentYear>` is computed in-test via `new Date().getFullYear()` (mirrors the component's runtime logic, so the assertion does not rot across years)
      2. Step: Navigate to an unknown route (e.g. `/this-route-does-not-exist`) that renders the NotFound page
        Expectation: The same footer is still visible with the same current-year copyright text (confirms it renders globally, even on unmatched routes)
      3. Step: Navigate to / and query the `contentinfo` landmark role
        Expectation: Exactly one `contentinfo` landmark exists, and it contains both the `©` symbol and the current year (accessibility landmark uniqueness check)
15. **Footer navigation links route to About, Contact, and FAQ** — `tests/footer.spec.ts`
    - Preconditions: None — the footer `<nav aria-label="Footer">` is a global component rendered on every route; nothing to create or clean up. Footer links are scoped to the `contentinfo` landmark because the navbar exposes links with the same accessible names (About/Contact/FAQ).
    - Step/Expectation Pairs:
      1. Step: Navigate to / and, within the footer nav (`getByRole('contentinfo').getByRole('navigation', { name: 'Footer' })`), click the "About" link
        Expectation: URL changes to /about and the "About Us" heading (level 1) is visible
      2. Step: Navigate to / and click the footer "Contact" link (same footer-scoped locator)
        Expectation: URL changes to /contact and the "Contact Us" heading (level 1) is visible
      3. Step: Navigate to / and click the footer "FAQ" link (same footer-scoped locator)
        Expectation: URL changes to /faq and the "Frequently Asked Questions" heading (level 1) is visible


### Feedback
12. **Feedback rejects submission when no rating is selected** — `tests/feedback.spec.ts`
    - Preconditions: None — `/feedback` is a public route; the form is in-memory component state that resets on navigation. Nothing to create or clean up.
    - Step/Expectation Pairs:
      1. Step: Navigate to / then click the "Feedback" navbar link
         Expectation: URL changes to /feedback and the "Feedback" heading (level 1) is visible
      2. Step: Without selecting a rating, click "Send feedback" (getByTestId('feedback-submit'))
         Expectation: The error alert (getByTestId('feedback-error'), role="alert") is visible with text "Please select a rating between 1 and 5.", and no success message (getByTestId('feedback-success')) is present
13. **Feedback submits successfully with a rating and optional comment** — `tests/feedback.spec.ts`
    - Preconditions: None — public `/feedback` route; nothing to create or clean up.
    - Step/Expectation Pairs:
      1. Step: Navigate to /feedback, select a rating (e.g. getByTestId('feedback-rating-4')) and type text into the comment field (getByTestId('feedback-comment'))
         Expectation: The rating radio is checked and the comment field holds the typed text
      2. Step: Click "Send feedback"
         Expectation: The success message (getByTestId('feedback-success'), role="status") is visible with text "Thanks for your feedback!", and no error alert (getByTestId('feedback-error')) is present
14. **Feedback clears the error and succeeds after a rating is chosen** — `tests/feedback.spec.ts`
    - Preconditions: None — public `/feedback` route; nothing to create or clean up.
    - Step/Expectation Pairs:
      1. Step: Navigate to /feedback and click "Send feedback" without selecting a rating
         Expectation: The error alert (getByTestId('feedback-error')) is visible with the "Please select a rating between 1 and 5." message
      2. Step: Select a valid rating (e.g. getByTestId('feedback-rating-5')) and click "Send feedback" again
         Expectation: The error alert is no longer present (count 0) and the success message (getByTestId('feedback-success')) becomes visible with "Thanks for your feedback!"

### Cookie Consent
19. **Cookie consent banner is shown to a first-time visitor and stays dismissed after Accept** — `tests/cookie-consent.spec.ts`
    - Preconditions: A first-time-visitor state — the `cookie-consent-accepted` localStorage key is not set for the origin. Each test runs in a fresh browser context whose localStorage starts empty (the shared auth `storageState` only logs in; it never accepts the banner), so the banner shows by default with no manual clearing. No server-side data is created.
    - Postconditions: None — the consent state lives only in the test's own browser-context localStorage, which is discarded when the context closes. Parallel-safe; nothing to clean up.
    - Step/Expectation Pairs:
      1. Step: Ensure `cookie-consent-accepted` is not set, then navigate to /
         Expectation: The cookie consent banner (getByRole('dialog', { name: 'Cookie consent' })) is visible and contains an "Accept" button (getByRole('button', { name: 'Accept' }))
      2. Step: Click the "Accept" button
         Expectation: The consent banner is no longer present (count 0) — accepting dismisses it immediately
      3. Step: Reload the page (same browser context)
         Expectation: The consent banner is still not present (count 0) — acceptance persists across reloads via localStorage, so a returning visitor is not shown the banner again
### Newsletter
19. **Newsletter subscribes successfully with a valid email and clears the field** — `tests/newsletter.spec.ts`
    - Preconditions: None — `/newsletter` is a public route; the form (email value, status, and the in-memory list of subscribed emails) is component state that resets on navigation. Nothing to create or clean up.
    - Postconditions: None — no server-side data is created; the subscription list lives only in the page's in-memory state and is discarded on navigation.
    - Step/Expectation Pairs:
      1. Step: Navigate to /newsletter, fill the email field (getByTestId('newsletter-email')) with a unique valid email, and click Subscribe (getByTestId('newsletter-subscribe'))
         Expectation: The success message (getByTestId('newsletter-success'), role="status") is visible with text "Thanks for subscribing! Please check your inbox to confirm.", and no error (getByTestId('newsletter-error')) or duplicate (getByTestId('newsletter-duplicate')) message is present
      2. Step: Inspect the email field after submission
         Expectation: The email field is cleared (empty value) — a successful subscription resets the input
20. **Newsletter rejects an invalid email address** — `tests/newsletter.spec.ts`
    - Preconditions: None — public `/newsletter` route; in-memory form state that resets on navigation. Nothing to create or clean up.
    - Postconditions: None.
    - Step/Expectation Pairs:
      1. Step: Navigate to /newsletter, fill the email field with a value that is not a valid email (e.g. "not-an-email"), and click Subscribe
         Expectation: The error alert (getByTestId('newsletter-error'), role="alert") is visible with text "Please enter a valid email address.", and no success message (getByTestId('newsletter-success')) is present
21. **Newsletter rejects a duplicate subscription within the same session** — `tests/newsletter.spec.ts`
    - Preconditions: None — public `/newsletter` route. The duplicate guard relies on the in-memory subscribed list, so both submissions happen within a single page load (no navigation/reload between them, or the list resets). Nothing to create or clean up.
    - Postconditions: None.
    - Step/Expectation Pairs:
      1. Step: Navigate to /newsletter, subscribe a unique valid email (fill getByTestId('newsletter-email') + click getByTestId('newsletter-subscribe'))
         Expectation: The success message (getByTestId('newsletter-success')) is visible
      2. Step: Without navigating away, fill the email field with the same email again and click Subscribe
         Expectation: The duplicate alert (getByTestId('newsletter-duplicate'), role="alert") is visible with text "You are already subscribed with this email.", and no success message (getByTestId('newsletter-success')) is present
22. **Newsletter subscriber count increments on success only and pluralizes correctly** — `tests/newsletter.spec.ts`
    - Preconditions: None — public `/newsletter` route; the subscriber count reflects the in-memory `subscribed` list, which resets on navigation, so a fresh visit starts at zero. All submissions in this test happen within a single page load (no navigation/reload between them). Nothing to create or clean up.
    - Postconditions: None — no server-side data; the in-memory count is discarded on navigation.
    - Step/Expectation Pairs:
      1. Step: Navigate to /newsletter and read the subscriber count line (getByTestId('newsletter-count'))
         Expectation: The count reads "0 subscribers" (plural on zero)
      2. Step: Subscribe a unique valid email (fill getByTestId('newsletter-email') + click getByTestId('newsletter-subscribe'))
         Expectation: The success message (getByTestId('newsletter-success')) is visible and the count reads exactly "1 subscriber" (singular on one)
      3. Step: Without navigating away, submit an invalid email (e.g. "not-an-email")
         Expectation: The error alert (getByTestId('newsletter-error')) is visible and the count still reads "1 subscriber" — a rejected submission does not increment the count
      4. Step: Without navigating away, re-submit the same valid email used in step 2
         Expectation: The duplicate alert (getByTestId('newsletter-duplicate')) is visible and the count still reads "1 subscriber" — a duplicate does not increment the count
      5. Step: Without navigating away, subscribe a second unique valid email
         Expectation: The count reads "2 subscribers" (plural on more than one)

### Home
23. **Home landing page renders the welcome heading and both call-to-action links** — `tests/home.spec.ts`
    - Preconditions: None — `/` is the public landing route; renders from static component markup with no auth or seeded data. Nothing to create or clean up.
    - Postconditions: None.
    - Step/Expectation Pairs:
      1. Step: Navigate to /
        Expectation: The "Welcome to Sample Web App" heading (level 1) is visible
      2. Step: Inspect the on-page call-to-action links (scoped to `<main>` so they are distinct from the navbar links)
        Expectation: A "Get Started" link and a "View Dashboard" link are both visible within the main content
24. **Home "Get Started" call-to-action navigates to the login page** — `tests/home.spec.ts`
    - Preconditions: None — public `/` route; nothing to create or clean up.
    - Postconditions: None.
    - Step/Expectation Pairs:
      1. Step: Navigate to / and click the "Get Started" link within `<main>` (getByRole('main').getByRole('link', { name: 'Get Started' }))
        Expectation: The URL changes to /login and the "Login" heading (level 1) is visible
25. **Home "View Dashboard" call-to-action navigates to the dashboard** — `tests/home.spec.ts`
    - Preconditions: Authenticated (storageState from auth.setup.ts) so `/dashboard` renders its authenticated content. `/` itself is public. Nothing to create or clean up.
    - Postconditions: None.
    - Step/Expectation Pairs:
      1. Step: Navigate to / and click the "View Dashboard" link within `<main>` (getByRole('main').getByRole('link', { name: 'View Dashboard' }))
        Expectation: The URL changes to /dashboard and the dashboard content (e.g. the "Dashboard" heading, level 1) is visible

### Not Found
26. **Unknown route renders the 404 page and "Back to Home" recovers to the landing page** — `tests/not-found.spec.ts`
    - Preconditions: None — any unmatched route renders the catch-all NotFound page (`path="*"` in `App.js`); public, no auth or seeded data. Nothing to create or clean up.
    - Postconditions: None.
    - Step/Expectation Pairs:
      1. Step: Navigate to an unknown route (e.g. /this-route-does-not-exist)
        Expectation: The NotFound page renders — getByTestId('not-found-page') is visible with the "404" heading (level 1), the "Page Not Found" heading (level 2), and a "Back to Home" link
      2. Step: Click the "Back to Home" link
        Expectation: The URL changes to / and the "Welcome to Sample Web App" heading (level 1) is visible (recovery to the landing page)
