import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate between pages using nav links', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByRole('link', { name: 'SampleApp' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
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

    await page.getByRole('link', { name: 'Home' }).click();
    await expect(page).toHaveURL('/');

    await page.goto('/login');
    await expect(page).toHaveURL(/.*login/);

    await page.getByRole('link', { name: 'SampleApp' }).click();
    await expect(page).toHaveURL('/');
  });
});
