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

In-repo, at `tests/specs/test-plan.md`. Markdown format: a top-level `# Test Plan`, an `## Application` blurb, then `## Suites` containing one `### <Suite>` heading per feature area (Login, Dashboard, …). Each test is a numbered entry `**<name>** — \`tests/<file>.spec.ts\`` with `Preconditions:`, `Postconditions:`, and ordered Step/Expectation pairs. Later `plan` / `scout` runs should extend this file in place following the same convention rather than creating a new plan location.
