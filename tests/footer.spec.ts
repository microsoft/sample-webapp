import { test, expect } from '@playwright/test';

/**
 * Site footer end-to-end coverage.
 *
 * Footer.js renders a global <footer className="app-footer"> (ARIA role
 * "contentinfo") that includes "© {year} SampleApp. All rights reserved.", where
 * year = new Date().getFullYear() is computed at runtime. App.js renders it
 * outside <Routes>, so it appears on every route. We assert with the year
 * computed in-test so the expectation mirrors the component's own logic and does
 * not rot across calendar years. The footer also renders navigation links and a
 * tagline alongside the copyright, so we target the copyright text node within
 * the footer's semantic (contentinfo) landmark rather than the whole footer.
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
      await expect(footer.getByText(copyright, { exact: true })).toBeVisible();
    });
  }

  test('still renders on an unknown (404) route', async ({ page }) => {
    await page.goto('/this-route-does-not-exist');
    const footer = page.getByRole('contentinfo');
    await expect(footer).toBeVisible();
    await expect(footer.getByText(copyright, { exact: true })).toBeVisible();
  });

  test('exposes exactly one contentinfo landmark with the copyright symbol', async ({ page }) => {
    await page.goto('/');
    const footers = page.getByRole('contentinfo');
    await expect(footers).toHaveCount(1);
    await expect(footers).toContainText('©');
    await expect(footers).toContainText(String(currentYear));
  });

  // The footer <nav aria-label="Footer"> exposes links whose accessible names
  // (About/Contact/FAQ) collide with the navbar's, so scope to the footer landmark.
  const footerLinks = [
    { name: 'About', path: '/about', heading: 'About Us' },
    { name: 'Contact', path: '/contact', heading: 'Contact Us' },
    { name: 'FAQ', path: '/faq', heading: 'Frequently Asked Questions' },
  ];

  for (const { name, path, heading } of footerLinks) {
    test(`footer ${name} link navigates to ${path}`, async ({ page }) => {
      await page.goto('/');

      const footerNav = page
        .getByRole('contentinfo')
        .getByRole('navigation', { name: 'Footer' });
      await footerNav.getByRole('link', { name }).click();

      await expect(page).toHaveURL(new RegExp(`${path}$`));
      await expect(page.getByRole('heading', { name: heading, level: 1 })).toBeVisible();
    });
  }
});
