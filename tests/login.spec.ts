import { test, expect } from '@playwright/test';

test.describe('Login page', () => {
  test('should display login form with username and password fields', async ({ page }) => {
    await page.goto('/login');

    await expect(page).toHaveTitle(/Login/);
    await expect(page.getByRole('heading', { name: 'Login', level: 1 })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Username' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Login' })).toBeEnabled();
  });

  test('should login successfully with valid credentials and redirect to dashboard', async ({ page }) => {
    const email = process.env.TEST_USER_EMAIL;
    const password = process.env.TEST_USER_PASSWORD;
    if (!email) throw new Error('TEST_USER_EMAIL is not set');
    if (!password) throw new Error('TEST_USER_PASSWORD is not set');

    await page.goto('/login');
    await page.getByRole('textbox', { name: 'Username' }).fill(email);
    await page.getByRole('textbox', { name: 'Password' }).fill(password);
    await page.getByRole('button', { name: 'Login' }).click();

    const message = page.getByRole('status');
    await expect(message).toBeVisible();
    await expect(message).toHaveClass(/success/);

    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('should display welcome message with username on successful login', async ({ page }) => {
    const email = process.env.TEST_USER_EMAIL;
    const password = process.env.TEST_USER_PASSWORD;
    if (!email) throw new Error('TEST_USER_EMAIL is not set');
    if (!password) throw new Error('TEST_USER_PASSWORD is not set');

    await page.goto('/login');
    await page.getByRole('textbox', { name: 'Username' }).fill(email);
    await page.getByRole('textbox', { name: 'Password' }).fill(password);
    await page.getByRole('button', { name: 'Login' }).click();

    const message = page.getByRole('status');
    await expect(message).toBeVisible();
    await expect(message).toContainText('Welcome');
    await expect(message).toContainText(email);

    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('should show error when submitting empty form', async ({ page }) => {
    await page.goto('/login');

    // Remove the required attributes to allow empty submission
    await page.getByRole('textbox', { name: 'Username' }).evaluate(
      (el: HTMLInputElement) => el.removeAttribute('required')
    );
    await page.getByRole('textbox', { name: 'Password' }).evaluate(
      (el: HTMLInputElement) => el.removeAttribute('required')
    );

    await page.getByRole('button', { name: 'Login' }).click();

    const message = page.getByRole('alert');
    await expect(message).toBeVisible();
    await expect(message).toHaveClass(/error/);
  });

  test('should reject a password shorter than 6 characters', async ({ page }) => {
    await page.goto('/login');

    await page.getByRole('textbox', { name: 'Username' }).fill('tester');
    await page.getByRole('textbox', { name: 'Password' }).fill('abc');
    await page.getByRole('button', { name: 'Login' }).click();

    const message = page.getByRole('alert');
    await expect(message).toBeVisible();
    await expect(message).toHaveText('Password must be at least 6 characters');

    // The guard blocks submission: no redirect to the dashboard occurs.
    await expect(page).toHaveURL(/.*login/);
  });

  test('should reveal and re-hide the password via the visibility toggle', async ({ page }) => {
    await page.goto('/login');

    const passwordInput = page.getByRole('textbox', { name: 'Password' });
    await passwordInput.fill('secret123');
    await expect(passwordInput).toHaveAttribute('type', 'password');

    const toggle = page.getByRole('button', { name: 'Show password' });
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');

    await toggle.click();

    // Revealing the password swaps the input to a plain text field.
    await expect(page.getByRole('textbox', { name: 'Password' })).toHaveAttribute('type', 'text');
    const hideToggle = page.getByRole('button', { name: 'Hide password' });
    await expect(hideToggle).toHaveAttribute('aria-pressed', 'true');

    await hideToggle.click();

    await expect(page.getByRole('textbox', { name: 'Password' })).toHaveAttribute('type', 'password');
    await expect(page.getByRole('button', { name: 'Show password' })).toHaveAttribute('aria-pressed', 'false');
  });
});
