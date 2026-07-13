import { test, expect } from '@playwright/test';

test.describe('Not Found page', () => {
  test('should show the 404 page for an unknown route and recover via "Back to Home"', async ({ page }) => {
    await page.goto('/this-route-does-not-exist');

    await expect(page.getByTestId('not-found-page')).toBeVisible();
    await expect(page.getByRole('heading', { name: '404', level: 1 })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Page Not Found', level: 2 })).toBeVisible();

    await page.getByRole('link', { name: 'Back to Home' }).click();

    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { name: 'Welcome to Sample Web App', level: 1 })).toBeVisible();
  });
});
