import { test, expect } from '@playwright/test';

/**
 * Feedback page (/feedback) end-to-end coverage.
 *
 * The page is a self-contained form (Feedback.js): a required rating radiogroup
 * (radios 1-5) plus an optional comment textarea. Submit logic:
 * - no rating (or out of range) -> role="alert" "Please select a rating between 1 and 5."
 * - a valid rating -> role="status" "Thanks for your feedback!" and any prior error clears.
 * The comment is never required. The rating lives in in-memory component state
 * (resets on navigation), but the comment is a *persisted draft*: it is saved to
 * localStorage['feedback-comment-draft'] on every change and restored on mount,
 * and is removed on "Clear comment" and on a successful submit. Tests that write
 * a draft therefore clear that key in cleanup so it can't bleed across tests.
 *
 * Selectors (data-testid): feedback-rating-1..5 (the radios), feedback-comment
 * (the textarea), feedback-submit (the "Send feedback" button),
 * feedback-success (role="status"), feedback-error (role="alert").
 * The live character counter is the paragraph #feedback-comment-count; the
 * "Clear comment" button is a plain button targeted by its accessible name.
 */

const DRAFT_KEY = 'feedback-comment-draft';

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

  test('should update the comment character counter live as the user types', async ({ page }) => {
    await page.goto('/feedback');

    const counter = page.locator('#feedback-comment-count');
    await expect(counter).toHaveText('0/300 characters');

    const comment = page.getByTestId('feedback-comment');
    await comment.fill('Great app');
    await expect(counter).toHaveText('9/300 characters');

    await page.evaluate((key) => localStorage.removeItem(key), DRAFT_KEY);
  });

  test('should persist the comment draft across a page reload', async ({ page }) => {
    await page.goto('/feedback');

    const draft = 'Draft that should survive a reload';
    const comment = page.getByTestId('feedback-comment');
    await comment.fill(draft);
    await expect(comment).toHaveValue(draft);
    await expect(page.locator('#feedback-comment-count')).toHaveText(`${draft.length}/300 characters`);

    await page.reload();

    const commentAfter = page.getByTestId('feedback-comment');
    await expect(commentAfter).toHaveValue(draft);
    await expect(page.locator('#feedback-comment-count')).toHaveText(`${draft.length}/300 characters`);

    await page.evaluate((key) => localStorage.removeItem(key), DRAFT_KEY);
  });

  test('should clear the comment, counter, and saved draft via "Clear comment"', async ({ page }) => {
    await page.goto('/feedback');

    const comment = page.getByTestId('feedback-comment');
    await comment.fill('A comment to be cleared');
    await expect(page.locator('#feedback-comment-count')).toHaveText('23/300 characters');

    await page.getByRole('button', { name: 'Clear comment' }).click();

    await expect(comment).toHaveValue('');
    await expect(page.locator('#feedback-comment-count')).toHaveText('0/300 characters');

    await page.reload();
    await expect(page.getByTestId('feedback-comment')).toHaveValue('');
  });

  test('should clear the comment and saved draft after a successful submit', async ({ page }) => {
    await page.goto('/feedback');

    await page.getByTestId('feedback-rating-4').check();
    const comment = page.getByTestId('feedback-comment');
    await comment.fill('Feedback comment that submit should clear');
    await expect(comment).toHaveValue('Feedback comment that submit should clear');

    await page.getByTestId('feedback-submit').click();

    const success = page.getByTestId('feedback-success');
    await expect(success).toBeVisible();
    await expect(success).toContainText('Thanks for your feedback!');
    await expect(comment).toHaveValue('');

    await page.reload();
    await expect(page.getByTestId('feedback-comment')).toHaveValue('');
  });
});
