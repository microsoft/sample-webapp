import { test, expect } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';

/**
 * Contact page (/contact) end-to-end coverage.
 *
 * Test conventions used throughout this repo:
 * - Heading: <h1>Contact Us</h1>, targeted via
 *   getByRole('heading', { name: 'Contact Us', level: 1 }).
 * - Form fields: Name / Email / Message are <input>/<textarea> elements with an
 *   associated <label>; target via getByRole('textbox', { name }), scoped to the
 *   #contact-page-form form so locators stay unambiguous (the About page reuses
 *   the same accessible names).
 * - Field validation errors: rendered inside the form as <span role="alert">.
 *   The alert role does not expose a name-from-content accessible name, so target
 *   these by text scoped to the form (form.getByText(...)) rather than
 *   getByRole('alert', { name }). They live-update on change once a field has
 *   been touched (see useForm).
 * - Success feedback: a Toast component exposing data-testid="toast", rendered
 *   OUTSIDE the form; target via getByTestId('toast').
 */

const VALID_INPUT = {
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
  message: 'This is a valid message over ten characters.',
};

function contactForm(page: Page): Locator {
  return page.locator('#contact-page-form');
}

async function fillContactForm(
  form: Locator,
  { name, email, message }: { name: string; email: string; message: string }
): Promise<void> {
  await form.getByRole('textbox', { name: 'Name' }).fill(name);
  await form.getByRole('textbox', { name: 'Email' }).fill(email);
  await form.getByRole('textbox', { name: 'Message' }).fill(message);
}

test.describe('Contact page', () => {
  test('should submit successfully and show a confirmation toast', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: 'Contact' }).click();

    await expect(page).toHaveURL(/.*contact/);
    await expect(page.getByRole('heading', { name: 'Contact Us', level: 1 })).toBeVisible();

    const form = contactForm(page);
    await fillContactForm(form, VALID_INPUT);
    await form.getByRole('button', { name: 'Send Message' }).click();

    const toast = page.getByTestId('toast');
    await expect(toast).toBeVisible();
    await expect(toast).toContainText('Thanks! Your message has been sent.');

    await expect(form.getByRole('textbox', { name: 'Name' })).toHaveValue('');
    await expect(form.getByRole('textbox', { name: 'Email' })).toHaveValue('');
    await expect(form.getByRole('textbox', { name: 'Message' })).toHaveValue('');
    await expect(form.getByRole('alert')).toHaveCount(0);

    await toast.getByRole('button', { name: 'Close notification' }).click();
    await expect(toast).toHaveCount(0);
  });

  test('should reject invalid input with field errors and no toast', async ({ page }) => {
    await page.goto('/contact');

    await expect(page.getByRole('heading', { name: 'Contact Us', level: 1 })).toBeVisible();

    const form = contactForm(page);
    await form.getByRole('button', { name: 'Send Message' }).click();

    await expect(form.getByText('Name is required')).toBeVisible();
    await expect(form.getByText('Email is required')).toBeVisible();
    await expect(form.getByText('Message is required')).toBeVisible();
    await expect(page.getByTestId('toast')).toHaveCount(0);

    await fillContactForm(form, { name: 'Jane', email: 'not-an-email', message: 'short' });
    await form.getByRole('button', { name: 'Send Message' }).click();

    await expect(form.getByText('Enter a valid email address')).toBeVisible();
    await expect(form.getByText('Message must be at least 10 characters')).toBeVisible();
    await expect(form.getByText('Name is required')).toHaveCount(0);
    await expect(page.getByTestId('toast')).toHaveCount(0);
  });

  test('should clear a field error live once the field is corrected', async ({ page }) => {
    await page.goto('/contact');

    const form = contactForm(page);

    // Trigger validation on an empty submit so every field is marked touched.
    await form.getByRole('button', { name: 'Send Message' }).click();
    await expect(form.getByText('Name is required')).toBeVisible();
    await expect(form.getByText('Email is required')).toBeVisible();

    // Correcting a touched field clears only that field's error, without resubmitting.
    await form.getByRole('textbox', { name: 'Name' }).fill('Jane Doe');
    await expect(form.getByText('Name is required')).toHaveCount(0);
    await expect(form.getByText('Email is required')).toBeVisible();
    await expect(page.getByTestId('toast')).toHaveCount(0);
  });

  test('should show a single field error on blur without submitting', async ({ page }) => {
    await page.goto('/contact');

    const form = contactForm(page);

    // Focus then blur the empty Name field (move focus to Email) — no submit.
    await form.getByRole('textbox', { name: 'Name' }).focus();
    await form.getByRole('textbox', { name: 'Email' }).focus();

    // Only the blurred field is validated; the still-untouched fields stay error-free.
    await expect(form.getByText('Name is required')).toBeVisible();
    await expect(form.getByText('Email is required')).toHaveCount(0);
    await expect(form.getByText('Message is required')).toHaveCount(0);
    await expect(page.getByTestId('toast')).toHaveCount(0);

    // Blurring the empty Email in turn validates only that field, adding its error.
    await form.getByRole('textbox', { name: 'Message' }).focus();
    await expect(form.getByText('Email is required')).toBeVisible();
    await expect(form.getByText('Message is required')).toHaveCount(0);
    await expect(page.getByTestId('toast')).toHaveCount(0);
  });
});
