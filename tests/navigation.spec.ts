import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate between pages using nav links', async ({ page }) => {
    await page.goto('/login');

    const navbar = page
      .getByRole('navigation')
      .filter({ has: page.getByRole('link', { name: 'SampleApp' }) });

    await expect(page.getByRole('link', { name: 'SampleApp' })).toBeVisible();
    await expect(navbar.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible();

    await page.getByRole('link', { name: 'Dashboard' }).click();
    await expect(page).toHaveURL(/.*dashboard/);

    await page.getByRole('link', { name: 'Login' }).click();
    await expect(page).toHaveURL(/.*login/);
  });

  test('should navigate to home via Home link and logo', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/.*dashboard/);

    const navbar = page
      .getByRole('navigation')
      .filter({ has: page.getByRole('link', { name: 'SampleApp' }) });
    await navbar.getByRole('link', { name: 'Home' }).click();
    await expect(page).toHaveURL('/');

    await page.goto('/login');
    await expect(page).toHaveURL(/.*login/);

    await page.getByRole('link', { name: 'SampleApp' }).click();
    await expect(page).toHaveURL('/');
  });

  test('should navigate to the Newsletter page via the navbar Newsletter link', async ({ page }) => {
    await page.goto('/');

    // Scope to the header navbar (the nav containing the SampleApp logo); the
    // footer also exposes a Newsletter link, so an unscoped locator matches two.
    const navbar = page
      .getByRole('navigation')
      .filter({ has: page.getByRole('link', { name: 'SampleApp' }) });

    await navbar.getByRole('link', { name: 'Newsletter' }).click();

    await expect(page).toHaveURL(/.*newsletter/);
    await expect(page.getByRole('heading', { name: 'Newsletter', level: 1 })).toBeVisible();
  });
});
