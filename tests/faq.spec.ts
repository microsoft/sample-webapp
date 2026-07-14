import { test, expect } from '@playwright/test';

/**
 * FAQ page (/faq) end-to-end coverage.
 *
 * The FAQ is a single-open accordion: each question is a <button> exposing
 * aria-expanded, and its answer renders as a role="region" named by the question
 * (aria-labelledby the question button) only while open. Opening one question
 * collapses any previously open one (openIndex is a single value in FAQ.js).
 *
 * A search box (role="searchbox", accessible name "Search questions") filters the
 * list by question OR answer text (case-insensitive, trimmed). An empty query
 * shows all five FAQs; a query with no match replaces the accordion with a
 * role="status" empty-state message that echoes the trimmed query.
 */

const Q1 = 'What is Sample Web App?';
const Q2 = 'How do I create an account?';

test.describe('FAQ page', () => {
  test('should expand a question to reveal its answer and collapse it again', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: 'FAQ' }).click();

    await expect(page).toHaveURL(/.*faq/);
    await expect(
      page.getByRole('heading', { name: 'Frequently Asked Questions', level: 1 })
    ).toBeVisible();

    const firstQuestion = page.getByRole('button', { name: Q1 });

    // All questions start collapsed and no answer region is shown.
    await expect(firstQuestion).toHaveAttribute('aria-expanded', 'false');
    await expect(page.getByRole('region')).toHaveCount(0);

    // Opening the question reveals its answer region.
    await firstQuestion.click();
    await expect(firstQuestion).toHaveAttribute('aria-expanded', 'true');
    const answer = page.getByRole('region', { name: Q1 });
    await expect(answer).toBeVisible();
    await expect(answer).toContainText('Sample Web App is a modern React application');

    // Clicking the open question again collapses it.
    await firstQuestion.click();
    await expect(firstQuestion).toHaveAttribute('aria-expanded', 'false');
    await expect(page.getByRole('region', { name: Q1 })).toHaveCount(0);
  });

  test('should keep only one answer open at a time', async ({ page }) => {
    await page.goto('/faq');

    const firstQuestion = page.getByRole('button', { name: Q1 });
    const secondQuestion = page.getByRole('button', { name: Q2 });

    await firstQuestion.click();
    await expect(firstQuestion).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByRole('region', { name: Q1 })).toBeVisible();

    // Opening a different question collapses the first one.
    await secondQuestion.click();
    await expect(secondQuestion).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByRole('region', { name: Q2 })).toBeVisible();

    await expect(firstQuestion).toHaveAttribute('aria-expanded', 'false');
    await expect(page.getByRole('region', { name: Q1 })).toHaveCount(0);

    // Exactly one answer region is open at any time.
    await expect(page.getByRole('region')).toHaveCount(1);
  });

  test('search filter narrows the question list and clearing restores it', async ({ page }) => {
    await page.goto('/faq');

    const search = page.getByRole('searchbox', { name: 'Search questions' });
    const questions = page.getByRole('button').filter({ hasText: '?' });

    // All five questions are shown before filtering.
    await expect(page.getByRole('button', { name: Q1 })).toBeVisible();

    // "playwright" appears only in answer text (never in a question), so a match
    // proves the filter searches answer content, not just question titles.
    await search.fill('playwright');

    await expect(page.getByRole('button', { name: 'What is Sample Web App?' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Which technologies are used?' })).toBeVisible();
    await expect(questions).toHaveCount(2);
    await expect(page.getByRole('button', { name: Q2 })).toHaveCount(0);

    // Clearing the box restores the full list.
    await search.fill('');
    await expect(questions).toHaveCount(5);
  });

  test('search shows a results count while filtering and hides it when cleared', async ({ page }) => {
    await page.goto('/faq');

    const search = page.getByRole('searchbox', { name: 'Search questions' });

    // No results count is shown before any query is entered.
    await expect(page.getByText(/Showing \d+ of \d+ questions/)).toHaveCount(0);

    // "playwright" matches two of the five FAQs by answer text.
    await search.fill('playwright');
    await expect(page.getByText('Showing 2 of 5 questions')).toBeVisible();

    // Clearing the query removes the results count again.
    await search.fill('');
    await expect(page.getByText(/Showing \d+ of \d+ questions/)).toHaveCount(0);
  });

  test('search with no matches shows the empty-state message', async ({ page }) => {
    await page.goto('/faq');

    const search = page.getByRole('searchbox', { name: 'Search questions' });
    await search.fill('zzzznomatch');

    // The accordion is replaced by a role="status" empty-state that echoes the query.
    await expect(page.getByRole('button').filter({ hasText: '?' })).toHaveCount(0);
    const empty = page.getByRole('status');
    await expect(empty).toBeVisible();
    await expect(empty).toHaveText('No questions match "zzzznomatch".');
  });

  test('search clears when the Escape key is pressed', async ({ page }) => {
    await page.goto('/faq');

    const search = page.getByRole('searchbox', { name: 'Search questions' });
    const questions = page.getByRole('button').filter({ hasText: '?' });

    // Typing a term filters the list and shows the results count.
    await search.fill('dark');
    await expect(search).toHaveValue('dark');
    await expect(page.getByText('Showing 1 of 5 questions')).toBeVisible();

    // Pressing Escape in the search box clears the query and restores the full list.
    await search.press('Escape');
    await expect(search).toHaveValue('');
    await expect(page.getByText(/Showing \d+ of \d+ questions/)).toHaveCount(0);
    await expect(questions).toHaveCount(5);
  });

  test('Clear button resets the search and collapses any open answer', async ({ page }) => {
    await page.goto('/faq');

    const search = page.getByRole('searchbox', { name: 'Search questions' });
    const questions = page.getByRole('button').filter({ hasText: '?' });
    const clearButton = page.getByRole('button', { name: 'Clear' });

    // The Clear button only renders once the query is non-empty.
    await expect(clearButton).toHaveCount(0);

    // Typing a term that matches a single FAQ reveals the Clear button and filters the list.
    await search.fill('dark');
    await expect(clearButton).toBeVisible();
    const darkQuestion = page.getByRole('button', { name: 'Does the app support dark mode?' });
    await expect(darkQuestion).toBeVisible();
    await expect(questions).toHaveCount(1);
    await expect(page.getByText('Showing 1 of 5 questions')).toBeVisible();

    // Expand the matching answer so we can prove Clear also collapses it.
    await darkQuestion.click();
    await expect(darkQuestion).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByRole('region', { name: 'Does the app support dark mode?' })).toBeVisible();

    // Clicking Clear resets the query (restoring the full list, hiding the count) AND
    // collapses the open answer, and removes itself since the query is empty again.
    await clearButton.click();
    await expect(search).toHaveValue('');
    await expect(page.getByText(/Showing \d+ of \d+ questions/)).toHaveCount(0);
    await expect(questions).toHaveCount(5);
    await expect(
      page.getByRole('region', { name: 'Does the app support dark mode?' })
    ).toHaveCount(0);
    await expect(clearButton).toHaveCount(0);
  });
});
