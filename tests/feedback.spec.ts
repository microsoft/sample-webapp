import { test, expect } from '@playwright/test';

/**
 * Feedback page (/feedback) end-to-end coverage.
 *
 * The page is a self-contained form (Feedback.js): a required rating radiogroup
 * (radios 1-5) plus an optional comment textarea. Submit logic:
 * - no rating (or out of range) -> role="alert" "Please select a rating between 1 and 5."
 * - a valid rating -> role="status" "Thanks for your feedback!" and any prior error clears.
 * The comment is never required. Form state is in-memory and resets on navigation,
 * so each test starts clean simply by visiting the route.
 *
 * Selectors (data-testid): feedback-rating-1..5 (the radios), feedback-comment
 * (the textarea), feedback-submit (the "Send feedback" button),
 * feedback-success (role="status"), feedback-error (role="alert").
 */

test.describe('Feedback page', () => {
  test('should reject submission when no rating is selected', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: 'Feedback' }).click();

    await expect(page).toHaveURL(/.*feedback/);
    await expect(page.getByRole('heading', { name: 'Feedback', level: 1 })).toBeVisible();

    await page.getByTestId('feedback-submit').click();

    const error = page.getByTestId('feedback-error');
    await expect(error).toBeVisible();
    await expect(error).toContainText('Please select a rating between 1 and 5.');
    await expect(page.getByTestId('feedback-success')).toHaveCount(0);
  });

  test('should submit successfully with a rating and optional comment', async ({ page }) => {
    await page.goto('/feedback');

    const rating = page.getByTestId('feedback-rating-4');
    await rating.check();
    await expect(rating).toBeChecked();

    const comment = page.getByTestId('feedback-comment');
    await comment.fill('Great experience, thanks!');
    await expect(comment).toHaveValue('Great experience, thanks!');

    await page.getByTestId('feedback-submit').click();

    const success = page.getByTestId('feedback-success');
    await expect(success).toBeVisible();
    await expect(success).toContainText('Thanks for your feedback!');
    await expect(page.getByTestId('feedback-error')).toHaveCount(0);
  });

  test('should clear the error and succeed after a rating is chosen', async ({ page }) => {
    await page.goto('/feedback');

    await page.getByTestId('feedback-submit').click();

    const error = page.getByTestId('feedback-error');
    await expect(error).toBeVisible();
    await expect(error).toContainText('Please select a rating between 1 and 5.');

    await page.getByTestId('feedback-rating-5').check();
    await page.getByTestId('feedback-submit').click();

    await expect(page.getByTestId('feedback-error')).toHaveCount(0);
    const success = page.getByTestId('feedback-success');
    await expect(success).toBeVisible();
    await expect(success).toContainText('Thanks for your feedback!');
  });
});
