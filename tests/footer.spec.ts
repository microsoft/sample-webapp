import { test, expect } from '@playwright/test';

/**
 * Site footer end-to-end coverage.
 *
 * Footer.js renders a global <footer className="app-footer"> (ARIA role
 * "contentinfo") containing "© {year} SampleApp. All rights reserved.", where
 * year = new Date().getFullYear() is computed at runtime. App.js renders it
 * outside <Routes>, so it appears on every route. We assert with the year
 * computed in-test so the expectation mirrors the component's own logic and does
 * not rot across calendar years, and target the footer by its semantic role
 * rather than the .app-footer class.
 */

const currentYear = new Date().getFullYear();
const copyright = `© ${currentYear} SampleApp. All rights reserved.`;

test.describe('Site footer', () => {
  test('shows the runtime copyright year on every page', async ({ page }) => {
    await page.goto('/');
    const homeFooter = page.getByRole('contentinfo');
    await expect(homeFooter).toBeVisible();
    await expect(homeFooter).toHaveText(copyright);

    await page.goto('/login');
    const loginFooter = page.getByRole('contentinfo');
    await expect(loginFooter).toBeVisible();
    await expect(loginFooter).toHaveText(copyright);

    await page.goto('/dashboard');
    const dashboardFooter = page.getByRole('contentinfo');
    await expect(dashboardFooter).toBeVisible();
    await expect(dashboardFooter).toHaveText(copyright);
  });
});
