import { test, expect } from '@playwright/test';

/**
 * Scroll-to-top button (global ScrollToTop component) end-to-end coverage.
 *
 * The button (getByTestId('scroll-to-top'), aria-label "Scroll back to top")
 * renders nothing until the window is scrolled past 300px, then smooth-scrolls
 * back to the top on click and unmounts again once the offset drops to/below 300px.
 *
 * A short viewport is used so the tallest public page (/about) scrolls comfortably
 * past the 300px threshold; the button's presence is a faithful, web-first proxy
 * for scroll position, so no manual scroll-offset reads are needed.
 *
 * The global cookie-consent banner (fixed to the bottom of the viewport, above the
 * scroll-to-top button) is dismissed first — the shared auth storageState only logs
 * in and never accepts it, so a first-time-visitor banner would otherwise overlay
 * the button and intercept the click.
 */

test.use({ viewport: { width: 1280, height: 400 } });

test.describe('Scroll-to-top button', () => {
  test('should appear after scrolling down and return the page to the top', async ({ page }) => {
    await page.goto('/about');

    // Dismiss the consent banner so it doesn't overlay the bottom-anchored button.
    await page
      .getByRole('dialog', { name: 'Cookie consent' })
      .getByRole('button', { name: 'Accept' })
      .click();

    const scrollButton = page.getByTestId('scroll-to-top');

    // Hidden while the page is at the top.
    await expect(scrollButton).toHaveCount(0);

    // Scrolling past the 300px threshold reveals the button.
    await page.mouse.wheel(0, 600);
    await expect(scrollButton).toBeVisible();
    await expect(scrollButton).toHaveAccessibleName('Scroll back to top');

    // Clicking it returns to the top, so the button unmounts again.
    await scrollButton.click();
    await expect(scrollButton).toHaveCount(0);
  });
});
