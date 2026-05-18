import { test, expect } from '@playwright/test';

const email = process.env.TEST_USER_EMAIL;
const password = process.env.TEST_USER_PASSWORD;

if (!email) throw new Error('TEST_USER_EMAIL is not set');
if (!password) throw new Error('TEST_USER_PASSWORD is not set');

test.describe('Login to Dashboard journey', () => {
  test('should login and arrive at a fully rendered dashboard', async ({ page }) => {
    // Step 1: Navigate to /login — heading and form fields visible
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: 'Login', level: 1 })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Username' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();

    // Step 2: Fill credentials and submit — success message appears
    await page.getByRole('textbox', { name: 'Username' }).fill(email);
    await page.getByRole('textbox', { name: 'Password' }).fill(password);
    await page.getByRole('button', { name: 'Login' }).click();

    const message = page.locator('#message');
    await expect(message).toBeVisible();
    await expect(message).toHaveClass(/success/);

    // Step 3: Wait for redirect to /dashboard
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page).toHaveTitle(/Dashboard/);

    // Step 4: Verify dashboard content loaded
    await expect(page.getByRole('heading', { name: 'Dashboard', level: 1 })).toBeVisible();

    await expect(page.getByRole('heading', { name: 'Users', level: 3 })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Revenue', level: 3 })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Orders', level: 3 })).toBeVisible();

    const table = page.locator('#activity-table');
    await expect(table).toBeVisible();
    await expect(table.locator('tbody tr')).not.toHaveCount(0);
  });
});
