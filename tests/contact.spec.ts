import { test, expect } from '@playwright/test';

test.describe('Contact page', () => {
  test('should submit successfully and show a confirmation toast', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: 'Contact' }).click();

    await expect(page).toHaveURL(/.*contact/);
    await expect(page.getByRole('heading', { name: 'Contact Us', level: 1 })).toBeVisible();

    await page.getByRole('textbox', { name: 'Name' }).fill('Jane Doe');
    await page.getByRole('textbox', { name: 'Email' }).fill('jane.doe@example.com');
    await page.getByRole('textbox', { name: 'Message' }).fill('This is a valid message over ten characters.');
    await page.getByRole('button', { name: 'Send Message' }).click();

    const toast = page.getByTestId('toast');
    await expect(toast).toBeVisible();
    await expect(toast).toContainText('Thanks! Your message has been sent.');

    await expect(page.getByRole('textbox', { name: 'Name' })).toHaveValue('');
    await expect(page.getByRole('textbox', { name: 'Email' })).toHaveValue('');
    await expect(page.getByRole('textbox', { name: 'Message' })).toHaveValue('');
    await expect(page.getByText('Name is required')).toHaveCount(0);
    await expect(page.getByText('Email is required')).toHaveCount(0);
    await expect(page.getByText('Message is required')).toHaveCount(0);

    await toast.getByRole('button', { name: 'Close notification' }).click();
    await expect(toast).toHaveCount(0);
  });

  test('should reject invalid input with field errors and no toast', async ({ page }) => {
    await page.goto('/contact');

    await expect(page.getByRole('heading', { name: 'Contact Us', level: 1 })).toBeVisible();

    await page.getByRole('button', { name: 'Send Message' }).click();

    await expect(page.getByText('Name is required')).toBeVisible();
    await expect(page.getByText('Email is required')).toBeVisible();
    await expect(page.getByText('Message is required')).toBeVisible();
    await expect(page.getByTestId('toast')).toHaveCount(0);

    await page.getByRole('textbox', { name: 'Name' }).fill('Jane');
    await page.getByRole('textbox', { name: 'Email' }).fill('not-an-email');
    await page.getByRole('textbox', { name: 'Message' }).fill('short');
    await page.getByRole('button', { name: 'Send Message' }).click();

    await expect(page.getByText('Enter a valid email address')).toBeVisible();
    await expect(page.getByText('Message must be at least 10 characters')).toBeVisible();
    await expect(page.getByText('Name is required')).toHaveCount(0);
    await expect(page.getByTestId('toast')).toHaveCount(0);
  });
});
