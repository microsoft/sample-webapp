import { test, expect } from '@playwright/test';

test.describe('Login page', () => {
  test('should display login form with username and password fields', async ({ page }) => {
    await page.goto('/login');

    await expect(page).toHaveTitle(/Login/);
    await expect(page.getByRole('heading', { name: 'Login', level: 1 })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Username' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
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

    const message = page.locator('#message');
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

    const message = page.locator('#message');
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

    const message = page.locator('#message');
    await expect(message).toBeVisible();
    await expect(message).toHaveClass(/error/);
    await expect(message).toContainText('Username and password required');
  });

  test('should redirect to dashboard with full content after login', async ({ page }) => {
    const email = process.env.TEST_USER_EMAIL;
    const password = process.env.TEST_USER_PASSWORD;
    if (!email) throw new Error('TEST_USER_EMAIL is not set');
    if (!password) throw new Error('TEST_USER_PASSWORD is not set');

    await page.goto('/login');
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();

    await page.getByRole('textbox', { name: 'Username' }).fill(email);
    await page.getByRole('textbox', { name: 'Password' }).fill(password);
    await page.getByRole('button', { name: 'Login' }).click();

    const message = page.locator('#message');
    await expect(message).toBeVisible();
    await expect(message).toContainText('Welcome');

    await expect(page).toHaveURL(/.*dashboard/);

    await expect(page.getByRole('heading', { name: 'Dashboard', level: 1 })).toBeVisible();
    await expect(page.locator('#user-count')).not.toBeEmpty();
    await expect(page.locator('#revenue')).not.toBeEmpty();
    await expect(page.locator('#order-count')).not.toBeEmpty();
  });
});
