# Testing Agent Instructions

## Environments

- **Local**: http://localhost:3000

## Authentication

- **Mode**: `username_password`
- **MFA**: `none`
- **Env vars**: `TEST_USER_EMAIL`, `TEST_USER_PASSWORD`
- **Login flow**: Navigate to `/login`. Fill "Username" and "Password" fields, click "Login" button. On success, redirects to `/dashboard` after 1.5 s.

## Test Conventions

No existing Playwright tests found. `@playwright/test` ^1.48.0 is listed as a devDependency but no `playwright.config.ts` or test files exist yet.
