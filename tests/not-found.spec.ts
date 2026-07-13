import { test, expect } from '@playwright/test';

/**
 * Not Found page (catch-all `*` route) end-to-end coverage.
 *
 * NotFound.js renders for any unmatched route: a container with
 * data-testid="not-found-page", an <h1> "404", an <h2> "Page Not Found",
 * a short message, and a "Back to Home" link (-> /).
 *
 * The existing footer.spec.ts only asserts the global footer still renders on a
 * 404 route; this spec covers the NotFound page's own content and its recovery
 * link back to the landing page.
 */

test.describe('Not Found page', () => {
  test('should show the 404 page for an unknown route and recover via "Back to Home"', async ({ page }) => {
    await page.goto('/this-route-does-not-exist');

    await expect(page.getByTestId('not-found-page')).toBeVisible();
    await expect(page.getByRole('heading', { name: '404', level: 1 })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Page Not Found', level: 2 })).toBeVisible();

    await page.getByRole('link', { name: 'Back to Home' }).click();

    await expect(page).toHaveURL(/.*\/$/);
    await expect(page.getByRole('heading', { name: 'Welcome to Sample Web App', level: 1 })).toBeVisible();
  });
});
