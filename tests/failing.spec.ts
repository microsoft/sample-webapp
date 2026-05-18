import { test, expect } from '@playwright/test';

test.describe('Intentionally failing tests', () => {
  test('home page should have title "Sample Web App"', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('Sample Web App');
  });

  test('dashboard should show a stat card for "Revenue"', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.getByRole('heading', { name: 'Revenue', level: 3 })).toBeVisible();
  });

  test('login page should have a "Password" input', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByLabel('Password')).toBeVisible();
  });
});
