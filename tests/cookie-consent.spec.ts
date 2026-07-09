import { test, expect } from '@playwright/test';

/**
 * Cookie consent banner (global CookieConsent component) end-to-end coverage.
 *
 * The banner (getByRole('dialog', { name: 'Cookie consent' })) is shown only when
 * the localStorage key `cookie-consent-accepted` is not 'true'. Clicking "Accept"
 * sets the key to 'true', unmounts the banner immediately, and — because the state
 * is persisted — keeps it dismissed on subsequent visits (verified here via reload).
 *
 * Isolation: each test runs in a fresh browser context whose localStorage starts
 * empty (the shared auth storageState only logs in; it never accepts the banner),
 * so a first-time-visitor state is guaranteed without any manual clearing. The
 * banner's visibility is therefore a faithful, web-first proxy for the consent
 * state — no localStorage reads are needed.
 */

test.describe('Cookie consent banner', () => {
  test('is shown to a first-time visitor and stays dismissed after Accept', async ({ page }) => {
    await page.goto('/');

    const banner = page.getByRole('dialog', { name: 'Cookie consent' });
    const acceptButton = banner.getByRole('button', { name: 'Accept' });

    // First-time visitor sees the banner with an Accept control.
    await expect(banner).toBeVisible();
    await expect(acceptButton).toBeVisible();

    // Accepting dismisses the banner immediately.
    await acceptButton.click();
    await expect(banner).toHaveCount(0);

    // Acceptance persists across reloads, so a returning visitor is not shown it again.
    await page.reload();
    await expect(banner).toHaveCount(0);
  });
});
