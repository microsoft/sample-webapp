import { test, expect } from '@playwright/test';

/**
 * Newsletter page (/newsletter) end-to-end coverage.
 *
 * The page is a self-contained subscription form (Newsletter.js). Its
 * `subscribed` list is in-memory component state that resets on reload, so:
 * - each test starts from a clean list simply by navigating to the route, and
 * - the duplicate guard can only be exercised by resubscribing the SAME email
 *   within one page session (no reload between the two submits).
 *
 * Selectors (data-testid): newsletter-email (the input, also aria-label "email"),
 * newsletter-subscribe (the Subscribe button), newsletter-success (role="status"),
 * newsletter-error (role="alert"), newsletter-duplicate (role="alert").
 *
 * A unique email per test keeps the tests independent and parallel-safe.
 */

function uniqueEmail(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`;
}

test.describe('Newsletter page', () => {
  test('should subscribe successfully with a valid email and clear the field', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: 'Newsletter' }).click();

    await expect(page).toHaveURL(/.*newsletter/);
    await expect(page.getByRole('heading', { name: 'Newsletter', level: 1 })).toBeVisible();

    const email = page.getByTestId('newsletter-email');
    await email.fill(uniqueEmail('valid'));
    await page.getByTestId('newsletter-subscribe').click();

    const success = page.getByTestId('newsletter-success');
    await expect(success).toBeVisible();
    await expect(success).toContainText('Thanks for subscribing! Please check your inbox to confirm.');

    await expect(email).toHaveValue('');
    await expect(page.getByTestId('newsletter-error')).toHaveCount(0);
    await expect(page.getByTestId('newsletter-duplicate')).toHaveCount(0);
  });

  test('should reject an invalid email with an error and no success', async ({ page }) => {
    await page.goto('/newsletter');

    const email = page.getByTestId('newsletter-email');
    await email.fill('notanemail');
    await page.getByTestId('newsletter-subscribe').click();

    const error = page.getByTestId('newsletter-error');
    await expect(error).toBeVisible();
    await expect(error).toContainText('Please enter a valid email address.');

    await expect(page.getByTestId('newsletter-success')).toHaveCount(0);
    await expect(email).toHaveValue('notanemail');
  });

  test('should block a duplicate subscription within the same session', async ({ page }) => {
    await page.goto('/newsletter');

    const email = page.getByTestId('newsletter-email');
    const subscribe = page.getByTestId('newsletter-subscribe');
    const address = uniqueEmail('dup');

    await email.fill(address);
    await subscribe.click();

    const success = page.getByTestId('newsletter-success');
    await expect(success).toBeVisible();
    await expect(email).toHaveValue('');

    // Resubscribe the same address without reloading — the in-memory guard trips.
    await email.fill(address);
    await subscribe.click();

    const duplicate = page.getByTestId('newsletter-duplicate');
    await expect(duplicate).toBeVisible();
    await expect(duplicate).toContainText('You are already subscribed with this email.');
    await expect(page.getByTestId('newsletter-success')).toHaveCount(0);
  });
});
