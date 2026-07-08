# Testing Agent Instructions

## Environments

- **Local**: http://localhost:3000

## Authentication

- **Mode**: `username_password`
- **MFA**: `none`
- **Env vars**: `TEST_USER_EMAIL`, `TEST_USER_PASSWORD`
- **Login flow**: Navigate to `/login`. Fill "Username" and "Password" fields, click "Login" button. On success, redirects to `/dashboard` after 1.5 s.

## Test Conventions

Playwright `@playwright/test` ^1.48.0 with `dotenv` for env loading. Config: `playwright.config.ts` (baseURL `http://localhost:3000`, three projects: `setup`, `chromium`, `login-tests`). Tests live in `tests/` with `*.spec.ts` naming. A shared `auth.setup.ts` signs in once and saves `storageState` to `.testing-agent/auth/storageState.json`; the `chromium` project depends on it while `login-tests` runs without cached state. No page objects or custom fixtures yet.

## Test Plans

In-repo plan at `tests/specs/test-plan.md`. Format: a `# Test Plan` doc with an `## Application` overview and `## Suites` grouped by feature (Login, Dashboard, etc.); each entry is a numbered **bold test name** linked to its `tests/*.spec.ts` file, with Preconditions and numbered Step/Expectation pairs. Later `plan`/`scout` runs extend this file in place rather than creating a new plan location.
