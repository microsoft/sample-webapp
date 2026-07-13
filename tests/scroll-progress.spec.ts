import { test, expect } from '@playwright/test';

/**
 * Scroll progress bar (global ScrollProgress component) end-to-end coverage.
 *
 * ScrollProgress.js renders a global role="progressbar" (aria-label
 * "Page scroll progress") mounted outside <Routes> in App.js, so it appears on
 * every route. Its aria-valuenow tracks how far the page is scrolled as a
 * percentage: 0 at the very top, 100 once scrolled to the bottom.
 *
 * A short viewport is used so the tallest public page (/about) is comfortably
 * scrollable; aria-valuenow is a faithful, web-first proxy for scroll position.
 */

test.use({ viewport: { width: 1280, height: 400 } });

test.describe('Scroll progress bar', () => {
  test('reflects scroll position from the top (0) to the bottom (100)', async ({ page }) => {
    await page.goto('/about');

    const progressBar = page.getByRole('progressbar', { name: 'Page scroll progress' });

    // At the top of the page nothing is scrolled, so the bar reads 0%.
    await expect(progressBar).toHaveAttribute('aria-valuenow', '0');

    // Scrolling to the bottom fills the bar to 100%.
    await page.keyboard.press('End');
    await expect(progressBar).toHaveAttribute('aria-valuenow', '100');
  });
});
