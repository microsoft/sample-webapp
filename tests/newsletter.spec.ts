import { test, expect } from '@playwright/test';

/**
 * Newsletter signup page (/newsletter) end-to-end coverage.
 *
 * The page is a self-contained form (Newsletter.js): an email input plus a
 * Subscribe button. Submit logic:
 * - invalid email      -> role="alert" "Please enter a valid email address."
 * - already subscribed -> role="alert" "You are already subscribed with this email."
 * - a valid new email  -> role="status" "Thanks for subscribing! Please check your
 *   inbox to confirm." and the email field is cleared.
 * Only one status message renders at a time. The subscribed list is in-memory and
 * resets on navigation, so the duplicate guard only holds within a single page load
 * and each test starts clean simply by visiting the route.
 *
 * Selectors (data-testid): newsletter-email (the input), newsletter-subscribe
 * (the button), newsletter-success (role="status"), newsletter-error (role="alert"),
 * newsletter-duplicate (role="alert").
 */

// Unique per test run so tests stay self-describing and never collide in parallel.
const uniqueEmail = () => `scout-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`;

test.describe('Newsletter page', () => {
  test('should subscribe successfully with a valid email and clear the field', async ({ page }) => {
    await page.goto('/newsletter');

    const emailField = page.getByTestId('newsletter-email');
    await emailField.fill(uniqueEmail());
    await page.getByTestId('newsletter-subscribe').click();

    const success = page.getByTestId('newsletter-success');
    await expect(success).toBeVisible();
    await expect(success).toContainText('Thanks for subscribing! Please check your inbox to confirm.');
    await expect(page.getByTestId('newsletter-error')).toHaveCount(0);
    await expect(page.getByTestId('newsletter-duplicate')).toHaveCount(0);

    // A successful subscription resets the input.
    await expect(emailField).toHaveValue('');
  });

  test('should reject an invalid email address', async ({ page }) => {
    await page.goto('/newsletter');

    await page.getByTestId('newsletter-email').fill('not-an-email');
    await page.getByTestId('newsletter-subscribe').click();

    const error = page.getByTestId('newsletter-error');
    await expect(error).toBeVisible();
    await expect(error).toContainText('Please enter a valid email address.');
    await expect(page.getByTestId('newsletter-success')).toHaveCount(0);
  });

  test('should reject a duplicate subscription within the same session', async ({ page }) => {
    await page.goto('/newsletter');

    const emailField = page.getByTestId('newsletter-email');
    const subscribe = page.getByTestId('newsletter-subscribe');
    const email = uniqueEmail();

    // First subscription succeeds.
    await emailField.fill(email);
    await subscribe.click();
    await expect(page.getByTestId('newsletter-success')).toBeVisible();

    // Re-submitting the same email in the same page load is flagged as a duplicate.
    await emailField.fill(email);
    await subscribe.click();

    const duplicate = page.getByTestId('newsletter-duplicate');
    await expect(duplicate).toBeVisible();
    await expect(duplicate).toContainText('You are already subscribed with this email.');
    await expect(page.getByTestId('newsletter-success')).toHaveCount(0);
  });

  test('should increment the subscriber count on success only and pluralize it correctly', async ({ page }) => {
    await page.goto('/newsletter');

    const emailField = page.getByTestId('newsletter-email');
    const subscribe = page.getByTestId('newsletter-subscribe');
    const count = page.getByTestId('newsletter-count');

    // The subscribed list is in-memory and resets on navigation, so a fresh load reads zero.
    await expect(count).toHaveText('0 subscribers');

    // A successful subscription increments the count and uses the singular form.
    const firstEmail = uniqueEmail();
    await emailField.fill(firstEmail);
    await subscribe.click();
    await expect(page.getByTestId('newsletter-success')).toBeVisible();
    await expect(count).toHaveText('1 subscriber');

    // A rejected (invalid) submission must not increment the count.
    await emailField.fill('not-an-email');
    await subscribe.click();
    await expect(page.getByTestId('newsletter-error')).toBeVisible();
    await expect(count).toHaveText('1 subscriber');

    // A duplicate submission must not increment the count.
    await emailField.fill(firstEmail);
    await subscribe.click();
    await expect(page.getByTestId('newsletter-duplicate')).toBeVisible();
    await expect(count).toHaveText('1 subscriber');

    // A second distinct valid subscription increments again and uses the plural form.
    await emailField.fill(uniqueEmail());
    await subscribe.click();
    await expect(page.getByTestId('newsletter-success')).toBeVisible();
    await expect(count).toHaveText('2 subscribers');
  });
});
