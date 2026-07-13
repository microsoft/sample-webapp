import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test('should render the landing page with its call-to-action links', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Welcome to Sample Web App', level: 1 })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Get Started' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'View Dashboard' })).toBeVisible();
  });

  test('should navigate to login via the "Get Started" call-to-action', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: 'Get Started' }).click();

    await expect(page).toHaveURL(/.*login/);
    await expect(page.getByRole('heading', { name: 'Login', level: 1 })).toBeVisible();
  });

  test('should navigate to dashboard via the "View Dashboard" call-to-action', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: 'View Dashboard' }).click();

    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.getByRole('heading', { name: 'Dashboard', level: 1 })).toBeVisible();
  });
});
