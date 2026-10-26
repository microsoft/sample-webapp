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

  test('should reflect the comment length in the counter and cap input at 300 characters', async ({ page }) => {
    await page.goto('/feedback');

    const comment = page.getByTestId('feedback-comment');
    const counter = page.getByText(/\d+\/300 characters/);

    await expect(counter).toHaveText('0/300 characters');

    const shortComment = 'Great experience!';
    await comment.fill(shortComment);
    await expect(comment).toHaveValue(shortComment);
    await expect(counter).toHaveText(`${shortComment.length}/300 characters`);

    const overLimit = 'a'.repeat(305);
    await comment.fill(overLimit);
    await expect(comment).toHaveValue('a'.repeat(300));
    await expect(counter).toHaveText('300/300 characters');
  });

  test('should reset rating, comment, counter, and success message when Clear is clicked', async ({ page }) => {
    await page.goto('/feedback');

    const rating = page.getByTestId('feedback-rating-4');
    await rating.check();
    await expect(rating).toBeChecked();

    const comment = page.getByTestId('feedback-comment');
    await comment.fill('Some feedback to be cleared');

    await page.getByTestId('feedback-submit').click();

    const success = page.getByTestId('feedback-success');
    await expect(success).toBeVisible();
    await expect(success).toContainText('Thanks for your feedback!');

    await page.getByRole('button', { name: 'Clear' }).click();

    await expect(page.getByTestId('feedback-success')).toHaveCount(0);
    await expect(comment).toHaveValue('');
    await expect(page.getByText(/\d+\/300 characters/)).toHaveText('0/300 characters');
    await expect(rating).not.toBeChecked();
  });
});
