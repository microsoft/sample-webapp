# Test Conventions Reference

Concrete selector and ARIA conventions used across this repository.
Intended for Copilot agent sessions (heal, code review, new tests) so they
do not need to re-read every source file.

---

## 1. Login message — ARIA roles and `aria-live`

**Source:** `src/pages/Login.js`

The message `<div>` rendered below the form uses a **dynamic role**:

| State   | `role`   | CSS class        |
|---------|----------|------------------|
| Success | `status` | `message success` |
| Error   | `alert`  | `message error`  |

Both states also carry `aria-live="polite"` (static attribute — it does not
change with the role).

```jsx
<div
  id="message"
  role={error ? 'alert' : 'status'}
  aria-live="polite"
  className={`message ${error ? 'error' : 'success'}`}
>
  {message}
</div>
```

---

## 2. How Playwright specs assert on login messages

**Source:** `tests/login.spec.ts`

Specs use `getByRole` — never a CSS selector or `#message` ID — because the
role itself encodes the pass/fail state.

```ts
// Success
const message = page.getByRole('status');
await expect(message).toBeVisible();
await expect(message).toHaveClass(/success/);
await expect(message).toContainText('Welcome');

// Error
const message = page.getByRole('alert');
await expect(message).toBeVisible();
await expect(message).toHaveClass(/error/);
```

Form field selectors use `getByRole('textbox', { name: … })` and
`getByRole('button', { name: … })`, matching the `<label>` text:

```ts
page.getByRole('textbox', { name: 'Username' })
page.getByRole('textbox', { name: 'Password' })
page.getByRole('button',  { name: 'Login' })
```

---

## 3. Dashboard stat cards — structure and test selectors

**Source:** `src/pages/Dashboard.js`, `tests/dashboard.spec.ts`

Each stat card is a `<div class="card">` containing:

- `<h3>` — the label (`Users`, `Revenue`, `Orders`)
- `<p class="stat" id="…">` — the value (rendered after the 900 ms
  loading delay)

Stat `id` values are: `user-count`, `revenue`, `order-count`.

```jsx
<div className="card">
  <h3>{stat.label}</h3>
  <p className="stat" id={stat.id}>{stat.value}</p>
</div>
```

**Test strategy** — headings via `getByRole`, values via `locator('#id')`:

```ts
// Heading presence
await expect(page.getByRole('heading', { name: 'Users',   level: 3 })).toBeVisible();
await expect(page.getByRole('heading', { name: 'Revenue', level: 3 })).toBeVisible();
await expect(page.getByRole('heading', { name: 'Orders',  level: 3 })).toBeVisible();

// Value assertions
await expect(page.locator('#user-count')).toHaveText('128');
await expect(page.locator('#revenue')).toHaveText('$12,450');
await expect(page.locator('#order-count')).toHaveText('340');
```

The parent grid sets `aria-busy={isChartsLoading}` during the loading phase.

---

## 4. Chart-skeleton loading state

**Source:** `src/pages/Dashboard.js`, `src/pages/Dashboard.css`

While `isChartsLoading` is `true` (first 900 ms), each stat card renders a
skeleton `<div>` in place of the value `<p>`:

```jsx
<div
  className="chart-skeleton"
  role="status"
  aria-label={`Loading ${stat.label} chart`}
/>
```

- **Role:** `status`
- **`aria-label` pattern:** `"Loading <label> chart"` — e.g.
  `"Loading Users chart"`, `"Loading Revenue chart"`, `"Loading Orders chart"`

The skeleton is an empty self-closing `<div>` (no inner text).

To target a specific skeleton in tests:

```ts
page.getByRole('status', { name: 'Loading Users chart' })
```

---

## 5. `prefers-reduced-motion` handling

**Source:** `src/pages/Dashboard.css`

The shimmer animation on `.chart-skeleton` is suppressed for users who
prefer reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  .chart-skeleton {
    animation: none;
    background: var(--color-border);
  }
}
```

There is **no JavaScript-level** reduced-motion check; the handling is
CSS-only. In Playwright tests that need to simulate reduced motion, use:

```ts
await page.emulateMedia({ reducedMotion: 'reduce' });
```

---

## File paths quick-reference

| Purpose                        | Path                          |
|--------------------------------|-------------------------------|
| Login component                | `src/pages/Login.js`          |
| Login styles                   | `src/pages/Login.css`         |
| Dashboard component            | `src/pages/Dashboard.js`      |
| Dashboard styles               | `src/pages/Dashboard.css`     |
| Login Playwright spec          | `tests/login.spec.ts`         |
| Dashboard Playwright spec      | `tests/dashboard.spec.ts`     |
| Shared auth setup              | `tests/auth.setup.ts`         |
| Playwright config              | `playwright.config.ts`        |
| Test plan (prose)              | `tests/specs/test-plan.md`    |
