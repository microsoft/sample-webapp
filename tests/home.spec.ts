import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test('should render the welcome heading and all call-to-action links', async ({ page }) => {
    await page.goto('/');

    await expect(
      page.getByRole('heading', { name: 'Welcome to Sample Web App', level: 1 })
    ).toBeVisible();

    // Scope the CTAs to <main> so they are distinct from the navbar links.
    const main = page.getByRole('main');
    await expect(main.getByRole('link', { name: 'Get Started' })).toBeVisible();
    await expect(main.getByRole('link', { name: 'View Dashboard' })).toBeVisible();
    await expect(main.getByRole('link', { name: 'Learn More' })).toBeVisible();
  });

  test('"Get Started" call-to-action navigates to the login page', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('main').getByRole('link', { name: 'Get Started' }).click();

    await expect(page).toHaveURL(/.*login/);
    await expect(page.getByRole('heading', { name: 'Login', level: 1 })).toBeVisible();
  });

  test('"View Dashboard" call-to-action navigates to the dashboard', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('main').getByRole('link', { name: 'View Dashboard' }).click();

    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.getByRole('heading', { name: 'Dashboard', level: 1 })).toBeVisible();
  });

  test('"Learn More" call-to-action navigates to the About page', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('main').getByRole('link', { name: 'Learn More' }).click();

    await expect(page).toHaveURL(/.*about/);
    await expect(page.getByRole('heading', { name: 'About Us', level: 1 })).toBeVisible();
  });

  test('"Contact us" hint navigates to the Contact page', async ({ page }) => {
    await page.goto('/');

    // The contact hint ("Have questions? Contact us.") lives in the main content,
    // distinct from the navbar/footer "Contact" links.
    const contactHint = page.getByRole('main').getByRole('link', { name: 'Contact us' });
    await expect(contactHint).toBeVisible();
    await contactHint.click();

    await expect(page).toHaveURL(/.*contact/);
    await expect(page.getByRole('heading', { name: 'Contact Us', level: 1 })).toBeVisible();
  });

  test('renders the description paragraph with the updated content-variant copy', async ({ page }) => {
    await page.goto('/');

    const description = page.getByRole('main').locator('#description');
    await expect(description).toBeVisible();

    // Asserts the copy PR #217 introduced: the original base sentence plus the
    // appended feature-branch variant sentence.
    await expect(description).toContainText(
      'A React web application built for Playwright testing.'
    );
    await expect(description).toContainText(
      'Feature branch users/dev83 adds a homepage content variant.'
    );
  });

  test('renders the Features section with all feature items', async ({ page }) => {
    await page.goto('/');

    const features = page.getByRole('main').locator('#features');
    await expect(features.getByRole('heading', { name: 'Features', level: 2 })).toBeVisible();

    const items = features.getByRole('listitem');
    await expect(items).toHaveText([
      'User authentication with form validation',
      'Interactive dashboard with stats',
      'Client-side routing with React Router',
      'Responsive design',
    ]);
  });
});
