import { test, expect } from '@playwright/test';

test.describe('Intentionally failing tests', () => {
  test('home page should have title "My Awesome App"', async ({ page }) => {
    await page.goto('/');
    // Real title is "Sample Web App" — this will fail
    await expect(page).toHaveTitle('My Awesome App');
  });

  test('dashboard should show a stat card for "Profit"', async ({ page }) => {
    await page.goto('/dashboard');
    // No "Profit" card exists — only Users, Revenue, Orders
    await expect(page.getByRole('heading', { name: 'Profit', level: 3 })).toBeVisible();
  });

  test('login page should have a "Remember me" checkbox', async ({ page }) => {
    await page.goto('/login');
    // No such checkbox exists on the login form
    await expect(page.getByRole('checkbox', { name: 'Remember me' })).toBeVisible();
  });
});
