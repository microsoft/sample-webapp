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
});
