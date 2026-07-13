import { test, expect } from '@playwright/test';

/**
 * Home landing page (/) end-to-end coverage.
 *
 * The landing page (Home.js) renders the "Welcome to Sample Web App" heading and
 * two on-page call-to-action links inside <main>: "Get Started" (-> /login) and
 * "View Dashboard" (-> /dashboard). CTAs are scoped to the main content via
 * getByRole('main') so they never collide with the persistent navbar links.
 */

test.describe('Home page', () => {
  test('should render the landing heading and both call-to-action links', async ({ page }) => {
    await page.goto('/');

    await expect(
      page.getByRole('heading', { name: 'Welcome to Sample Web App', level: 1 })
    ).toBeVisible();

    const main = page.getByRole('main');
    await expect(main.getByRole('link', { name: 'Get Started' })).toBeVisible();
    await expect(main.getByRole('link', { name: 'View Dashboard' })).toBeVisible();
  });

  test('should navigate to login via the "Get Started" call-to-action', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('main').getByRole('link', { name: 'Get Started' }).click();

    await expect(page).toHaveURL(/.*login/);
    await expect(page.getByRole('heading', { name: 'Login', level: 1 })).toBeVisible();
  });

  test('should navigate to dashboard via the "View Dashboard" call-to-action', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('main').getByRole('link', { name: 'View Dashboard' }).click();

    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.getByRole('heading', { name: 'Dashboard', level: 1 })).toBeVisible();
  });
});
