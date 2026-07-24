import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test('should render the welcome heading and all call-to-action links', async ({ page }) => {
    await page.goto('/');

    await expect(
      page.getByRole('heading', { name: 'Welcome to Sample Web App', level: 1 })
    ).toBeVisible();

    // The homepage description paragraph carries the content variant added by
    // PR #143 for users/dev34. Assert the full rendered copy.
    await expect(page.locator('#description')).toHaveText(
      'A React web application built for Playwright testing. Feature branch users/dev34 adds a homepage content variant.'
    );

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
});
