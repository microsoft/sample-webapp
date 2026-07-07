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

// Every public route in App.js renders the global <Footer /> outside <Routes>.
const publicRoutes = ['/', '/login', '/dashboard', '/about', '/contact', '/faq'];

test.describe('Site footer', () => {
  for (const route of publicRoutes) {
    test(`shows the runtime copyright year on ${route}`, async ({ page }) => {
      await page.goto(route);
      const footer = page.getByRole('contentinfo');
      await expect(footer).toBeVisible();
      await expect(footer).toHaveText(copyright);
    });
  }

  test('still renders on an unknown (404) route', async ({ page }) => {
    await page.goto('/this-route-does-not-exist');
    const footer = page.getByRole('contentinfo');
    await expect(footer).toBeVisible();
    await expect(footer).toHaveText(copyright);
  });
});
