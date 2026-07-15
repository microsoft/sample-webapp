import { test, expect } from '@playwright/test';

test.describe('About page', () => {
  test('should display content sections and keep an interactive contact form', async ({ page }) => {
    await page.goto('/');

    const navbar = page
      .getByRole('navigation')
      .filter({ has: page.getByRole('link', { name: 'SampleApp' }) });
    await navbar.getByRole('link', { name: 'About' }).click();

    await expect(page).toHaveURL(/.*about/);
    await expect(page.getByRole('heading', { name: 'About Us', level: 1 })).toBeVisible();

    await expect(page.getByRole('heading', { name: 'Our Team', level: 2 })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Kashish Gupta', level: 3 })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Copilot', level: 3 })).toBeVisible();

    await expect(page.getByRole('heading', { name: 'Tech Stack', level: 2 })).toBeVisible();
    const techStack = page.getByRole('list');
    await expect(techStack.getByRole('listitem').filter({ hasText: 'React 18' })).toBeVisible();
    await expect(techStack.getByRole('listitem').filter({ hasText: 'React Router v6' })).toBeVisible();
    await expect(techStack.getByRole('listitem').filter({ hasText: 'Playwright' })).toBeVisible();
    await expect(techStack.getByRole('listitem').filter({ hasText: 'CSS3' })).toBeVisible();

    await page.getByRole('textbox', { name: 'Name' }).fill('Test User');
    await page.getByRole('textbox', { name: 'Email' }).fill('test.user@example.com');
    await page.getByRole('textbox', { name: 'Message' }).fill('Hello from the test suite.');
    await page.getByRole('button', { name: 'Send Message' }).click();

    await expect(page).toHaveURL(/.*about/);
    await expect(page.getByRole('heading', { name: 'About Us', level: 1 })).toBeVisible();
  });
});
